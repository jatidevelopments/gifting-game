import { AssignmentStatus } from "@prisma/client";
import crypto from "crypto";
import OpenAI from "openai";
import { z } from "zod";
import { AppError, handlePrismaError } from "./errors";
import { createRouter, publicProcedure } from "./trpc";
import type { AssignmentWithRelations } from "./types";
import { shuffle } from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createWordTriplets(adjectives: any[], numParticipants: number) {
  console.info(
    "🎲 Generating word triplets for",
    numParticipants,
    "participants",
  );
  // Group adjectives by category for reference
  const adjectivesByCategory = adjectives.reduce(
    (acc, adj) => {
      const categoryName = adj.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(adj.word);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // Create a prompt that explains the task and provides context
  const prompt = `As a Secret Santa gift exchange assistant, create ${numParticipants} sets of 3 descriptive words each. Each set should work well together to inspire meaningful gift ideas.

Available words by category:
${Object.entries(adjectivesByCategory)
  .map(([category, words]: any) => `${category}: ${words.join(", ")}`)
  .join("\n")}

Rules:
1. Each set must contain exactly 3 words from the provided lists
2. Words should complement each other and make sense together for gift-giving
3. Try to use words from different categories when possible
4. Each word can only be used once
5. Return the sets in the following JSON format:
{
  "wordSets": [
    {"words": ["word1", "word2", "word3"]},
    {"words": ["word4", "word5", "word6"]},
    ...
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    console.info("🎯 Generated word combinations:", response);

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const parsedResponse = JSON.parse(response);
    console.log(
      "Generated word triplets:",
      JSON.stringify(parsedResponse, null, 2),
    );

    if (!parsedResponse.wordSets || !Array.isArray(parsedResponse.wordSets)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Map the word strings back to adjective objects
    const wordToAdjective = new Map(
      adjectives.map((adj) => [adj.word.toLowerCase(), adj]),
    );

    return parsedResponse.wordSets.map((set: { words: string[] }) => {
      if (!set.words || !Array.isArray(set.words) || set.words.length !== 3) {
        throw new Error("Invalid word set format");
      }

      const tripletAdjectives = set.words.map((word) => {
        const adjective = wordToAdjective.get(word.toLowerCase());
        if (!adjective) {
          throw new Error(
            `Word "${word}" not found in original adjectives list`,
          );
        }
        return adjective;
      });

      if (tripletAdjectives.length !== 3) {
        throw new Error("Failed to map all words to adjectives");
      }

      return tripletAdjectives;
    });
  } catch (error) {
    console.error("Error creating word triplets:", error);
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      "Failed to generate word combinations",
    );
  }
}

async function generateGiftIdeaImages(
  adjectiveDescriptions: string,
): Promise<string[]> {
  console.info("🎨 Generating gift idea images for:", adjectiveDescriptions);
  try {
    // First, generate three different gift ideas at once
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a practical gift advisor. Generate three completely different gift ideas that don't overlap in category or purpose.",
        },
        {
          role: "user",
          content: `Generate 3 different practical gift ideas for someone who is: ${adjectiveDescriptions}. 
          Requirements for each gift:
          - Must be available in common retail stores (Target, Amazon, etc.)
          - Price range: $10-50
          - Simple but thoughtful
          - Easy to wrap
          - No gift cards or generic items
          - Related to their characteristics
          - Something specific (e.g., "Leather-bound constellation sketching journal" not just "journal")
          - Each gift must be from a different category (e.g., don't suggest multiple books or multiple games)

          Return exactly 3 gift ideas, one per line, numbered 1-3. No explanations or additional text.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const giftIdeasText = completion.choices[0]?.message.content?.trim();
    console.info("🎁 Generated gift ideas:", giftIdeasText);

    if (!giftIdeasText) {
      console.error("Failed to generate gift ideas - empty response");
      return [];
    }

    // Split the response into individual gift ideas
    const giftIdeas = giftIdeasText
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((idea) => idea.length > 0);

    if (giftIdeas.length !== 3) {
      console.error(
        "Failed to generate 3 distinct gift ideas - got",
        giftIdeas.length,
      );
      return [];
    }

    // Generate an image for each gift idea
    const imagePrompt = (
      giftIdea: string,
    ) => `Create a product illustration of: ${giftIdea}
    Style: Modern product catalog illustration, minimalist and clean
    Must show: A clear, realistic representation of the exact product
    Perspective: Slightly angled 3/4 view to show depth
    Background: Simple gradient or solid color with subtle holiday sparkle
    Lighting: Soft, professional product photography style
    Colors: Rich and vibrant, product-accurate colors
    Details: Include product textures and materials
    Absolutely avoid: Generic gift wrapping, price tags, text, or unrealistic elements`;

    console.info("🎨 Starting image generation for ideas:", giftIdeas);

    // Create array of promises for image generation
    const imagePromises = giftIdeas.map(async (giftIdea, index) => {
      try {
        console.info(`🖼️ Generating image ${index + 1}/3 for:`, giftIdea);
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt(giftIdea),
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        });

        const imageUrl = response.data[0]?.url;
        console.info(
          `✅ Image ${index + 1}/3 generated successfully:`,
          imageUrl ? "URL received" : "No URL",
        );
        return imageUrl ?? null;
      } catch (error) {
        console.error(`❌ Error generating image ${index + 1}/3:`, error);
        return null;
      }
    });

    // Wait for all image generation promises to resolve
    const imageUrls = await Promise.all(imagePromises);
    console.info(
      "🎯 All image generations completed. Success rate:",
      imageUrls.filter(Boolean).length,
      "/ 3",
    );

    // Filter out any null values and return the successful image URLs
    return imageUrls.filter((url): url is string => url !== null);
  } catch (error) {
    console.error("❌ Error in gift idea image generation:", error);
    return [];
  }
}

async function generateGiftIdeas(
  adjectiveDescriptions: string,
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a creative gift advisor. Generate 3 unique and specific gift ideas based on the descriptive words provided. Each gift idea should incorporate aspects of all the descriptive words. Keep each gift idea concise (under 100 characters) and focus on tangible items.",
        },
        {
          role: "user",
          content: `Generate 3 gift ideas for someone who is described as: ${adjectiveDescriptions}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const ideas =
      completion.choices[0]?.message?.content
        ?.split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .slice(0, 3) ?? [];

    return ideas;
  } catch (error) {
    console.error("Error generating gift ideas:", error);
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      "Failed to generate gift ideas",
    );
  }
}

export const assignmentRouter = createRouter({
  getResults: publicProcedure
    .input(
      z.object({
        gameRoomId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }): Promise<AssignmentWithRelations[]> => {
      try {
        const assignments = await ctx.prisma.assignment.findMany({
          where: {
            gameRoomId: input.gameRoomId,
          },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return assignments.map((assignment) => {
          let status = assignment.status;

          // Update status based on gift ideas and images
          if (!status || status === AssignmentStatus.PENDING_GIFT_IDEAS) {
            if (assignment.giftIdeas.length > 0) {
              status = AssignmentStatus.PENDING_IMAGES;
            }
          }
          if (
            status === AssignmentStatus.PENDING_IMAGES &&
            assignment.giftIdeaImages.length > 0
          ) {
            status = AssignmentStatus.COMPLETED;
          }

          return {
            ...assignment,
            status: status || AssignmentStatus.PENDING_GIFT_IDEAS,
          };
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  generateAssignments: publicProcedure
    .input(
      z.object({
        gameRoomId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AssignmentWithRelations[]> => {
      console.info(
        "🎮 Starting assignment generation for game:",
        input.gameRoomId,
      );
      try {
        // Check if game room exists
        const gameRoom = await ctx.prisma.gameRoom.findUnique({
          where: { id: input.gameRoomId },
          include: {
            participants: true,
            adjectives: {
              include: {
                category: true,
              },
            },
          },
        });

        if (!gameRoom) {
          console.info("❌ Game room not found:", input.gameRoomId);
          throw new AppError("NOT_FOUND", "Game room not found");
        }

        console.info("👥 Participants count:", gameRoom.participants.length);
        console.info("✨ Adjectives count:", gameRoom.adjectives.length);

        // Check if there are enough participants
        if (gameRoom.participants.length < 2) {
          console.info("❌ Not enough participants");
          throw new AppError(
            "BAD_REQUEST",
            "At least 2 participants are required for assignment generation",
          );
        }

        // Check if there are enough adjectives
        const requiredAdjectives = gameRoom.participants.length * 3;
        if (gameRoom.adjectives.length < requiredAdjectives) {
          console.info("❌ Not enough adjectives");
          throw new AppError(
            "BAD_REQUEST",
            `At least ${requiredAdjectives} magic words are required for assignment generation`,
          );
        }

        // Delete all existing assignments for this game room
        console.info("🧹 Cleaning up existing assignments");
        await ctx.prisma.assignment.deleteMany({
          where: { gameRoomId: input.gameRoomId },
        });

        // Generate word triplets
        console.info("🎲 Generating word triplets");
        const wordTriplets = await createWordTriplets(
          gameRoom.adjectives,
          gameRoom.participants.length,
        );

        // Create assignments
        console.info("📝 Creating assignments");
        const assignments: AssignmentWithRelations[] = [];
        const participants = shuffle([...gameRoom.participants]);

        for (let i = 0; i < participants.length; i++) {
          const participant = participants[i];
          const receiver = participants[(i + 1) % participants.length];

          if (!participant || !receiver) {
            console.info("❌ Invalid participant or receiver");
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Failed to generate valid assignments",
            );
          }

          if (participant.id === receiver.id) {
            console.info(
              "❌ Invalid assignment: participant would be their own Secret Santa",
            );
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Failed to generate valid assignments",
            );
          }

          const triplet = wordTriplets[i];
          if (!triplet || triplet.length !== 3) {
            console.info("❌ Invalid word triplet");
            throw new AppError(
              "INTERNAL_SERVER_ERROR",
              "Invalid word triplet generated",
            );
          }

          console.info(
            `🎁 Creating assignment: ${participant.name} -> ${receiver.name}`,
          );
          const [adj1, adj2, adj3] = triplet;
          const assignment = await ctx.prisma.assignment.create({
            data: {
              gifterId: participant.id,
              receiverId: receiver.id,
              adjective1Id: adj1.id,
              adjective2Id: adj2.id,
              adjective3Id: adj3.id,
              gameRoomId: input.gameRoomId,
              accessUrl: crypto.randomUUID(),
              status: AssignmentStatus.PENDING_GIFT_IDEAS,
              giftIdeas: [],
              giftIdeaImages: [],
            },
            include: {
              gifter: true,
              receiver: true,
              adjective1: true,
              adjective2: true,
              adjective3: true,
              gameRoom: true,
            },
          });

          assignments.push(assignment);
        }

        console.info(
          "✅ Successfully created",
          assignments.length,
          "assignments",
        );
        return assignments;
      } catch (error) {
        console.error("❌ Error generating assignments:", error);
        throw handlePrismaError(error);
      }
    }),

  generateGiftIdeas: publicProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AssignmentWithRelations> => {
      console.info(
        "🎁 Generating gift ideas for assignment:",
        input.assignmentId,
      );
      try {
        const assignment = await ctx.prisma.assignment.findUnique({
          where: { id: input.assignmentId },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
        });

        if (!assignment) {
          console.info("❌ Assignment not found:", input.assignmentId);
          throw new AppError("NOT_FOUND", "Assignment not found");
        }

        const adjectiveDescriptions = `${assignment.adjective1.word}, ${assignment.adjective2.word}, ${assignment.adjective3.word}`;
        console.info("✨ Using adjectives:", adjectiveDescriptions);

        const giftIdeas = await generateGiftIdeas(adjectiveDescriptions);
        console.info("💡 Generated gift ideas:", giftIdeas);

        // Update assignment with gift ideas and set status to PENDING_IMAGES
        const updatedAssignment = await ctx.prisma.assignment.update({
          where: { id: input.assignmentId },
          data: {
            giftIdeas: giftIdeas,
            status: AssignmentStatus.PENDING_IMAGES,
          },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
        });

        return updatedAssignment;
      } catch (error) {
        console.error("❌ Error in generateGiftIdeas:", error);
        throw handlePrismaError(error);
      }
    }),

  generateGiftImages: publicProcedure
    .input(
      z.object({
        assignmentId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AssignmentWithRelations> => {
      console.info(
        "🎨 Generating gift images for assignment:",
        input.assignmentId,
      );
      try {
        const assignment = await ctx.prisma.assignment.findUnique({
          where: { id: input.assignmentId },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
        });

        if (!assignment) {
          console.info("❌ Assignment not found:", input.assignmentId);
          throw new AppError("NOT_FOUND", "Assignment not found");
        }

        if (assignment.status !== AssignmentStatus.PENDING_IMAGES) {
          console.info(
            "⚠️ Assignment not in PENDING_IMAGES state:",
            assignment.status,
          );
          throw new AppError(
            "BAD_REQUEST",
            "Assignment must be in PENDING_IMAGES state",
          );
        }

        const adjectiveDescriptions = `${assignment.adjective1.word}, ${assignment.adjective2.word}, ${assignment.adjective3.word}`;
        console.info("✨ Using adjectives:", adjectiveDescriptions);

        const imageUrls = await generateGiftIdeaImages(adjectiveDescriptions);
        console.info("🎨 Generated image URLs:", imageUrls);

        // Update assignment with images and set status to COMPLETED
        const updatedAssignment = await ctx.prisma.assignment.update({
          where: { id: input.assignmentId },
          data: {
            giftIdeaImages: imageUrls,
            status: AssignmentStatus.COMPLETED,
          },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
        });

        return updatedAssignment;
      } catch (error) {
        console.error("❌ Error in generateGiftImages:", error);
        throw handlePrismaError(error);
      }
    }),

  generateAllGiftIdeas: publicProcedure
    .input(
      z.object({
        gameRoomId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AssignmentWithRelations[]> => {
      console.info("🎁 Generating gift ideas for game room:", input.gameRoomId);

      // Get all assignments for this game room that need gift ideas
      const assignments = await ctx.prisma.assignment.findMany({
        where: {
          gameRoomId: input.gameRoomId,
          status: AssignmentStatus.PENDING_GIFT_IDEAS,
        },
        include: {
          gifter: true,
          receiver: true,
          adjective1: true,
          adjective2: true,
          adjective3: true,
          gameRoom: true,
        },
      });

      console.info(
        "📋 Found",
        assignments.length,
        "assignments needing gift ideas",
      );

      const updatedAssignments = [];
      for (const assignment of assignments) {
        try {
          const adjectiveDescriptions = `${assignment.adjective1.word}, ${assignment.adjective2.word}, ${assignment.adjective3.word}`;
          console.info(
            `✨ Generating ideas for ${assignment.receiver.name} using adjectives:`,
            adjectiveDescriptions,
          );

          // First verify the assignment still exists and is in the correct state
          const currentAssignment = await ctx.prisma.assignment.findUnique({
            where: { id: assignment.id },
            include: {
              gifter: true,
              receiver: true,
              adjective1: true,
              adjective2: true,
              adjective3: true,
              gameRoom: true,
            },
          });

          if (
            !currentAssignment ||
            currentAssignment.status !== AssignmentStatus.PENDING_GIFT_IDEAS
          ) {
            console.warn(
              `⚠️ Assignment ${assignment.id} no longer exists or has changed state`,
            );
            continue;
          }

          const giftIdeas = await generateGiftIdeas(adjectiveDescriptions);

          const updated = await ctx.prisma.assignment.update({
            where: {
              id: assignment.id,
              status: AssignmentStatus.PENDING_GIFT_IDEAS, // Only update if still in correct state
            },
            data: {
              giftIdeas: giftIdeas,
              status: AssignmentStatus.PENDING_IMAGES,
            },
            include: {
              gifter: true,
              receiver: true,
              adjective1: true,
              adjective2: true,
              adjective3: true,
              gameRoom: true,
            },
          });

          updatedAssignments.push(updated);
          console.info(
            `✅ Successfully generated gift ideas for ${assignment.receiver.name}`,
          );
        } catch (error) {
          console.error(
            "❌ Error processing assignment:",
            assignment.id,
            error,
          );
        }
      }

      return updatedAssignments;
    }),

  generateAllGiftImages: publicProcedure
    .input(
      z.object({
        gameRoomId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<AssignmentWithRelations[]> => {
      console.info(
        "🎨 Generating gift images for game room:",
        input.gameRoomId,
      );

      // Get all assignments for this game room that need images
      const assignments = await ctx.prisma.assignment.findMany({
        where: {
          gameRoomId: input.gameRoomId,
          status: AssignmentStatus.PENDING_IMAGES,
        },
        include: {
          gifter: true,
          receiver: true,
          adjective1: true,
          adjective2: true,
          adjective3: true,
          gameRoom: true,
        },
      });

      console.info(
        "📋 Found",
        assignments.length,
        "assignments needing images",
      );

      const updatedAssignments = [];
      for (const assignment of assignments) {
        try {
          const adjectiveDescriptions = `${assignment.adjective1.word}, ${assignment.adjective2.word}, ${assignment.adjective3.word}`;
          console.info(
            `✨ Generating images for ${assignment.receiver.name} using adjectives:`,
            adjectiveDescriptions,
          );

          // First verify the assignment still exists and is in the correct state
          const currentAssignment = await ctx.prisma.assignment.findUnique({
            where: { id: assignment.id },
            include: {
              gifter: true,
              receiver: true,
              adjective1: true,
              adjective2: true,
              adjective3: true,
              gameRoom: true,
            },
          });

          if (
            !currentAssignment ||
            currentAssignment.status !== AssignmentStatus.PENDING_IMAGES
          ) {
            console.warn(
              `⚠️ Assignment ${assignment.id} no longer exists or has changed state`,
            );
            continue;
          }

          // const imageUrls = await generateGiftIdeaImages(adjectiveDescriptions);

          const updated = await ctx.prisma.assignment.update({
            where: {
              id: assignment.id,
              status: AssignmentStatus.PENDING_IMAGES, // Only update if still in correct state
            },
            data: {
              // giftIdeaImages: imageUrls,
              status: AssignmentStatus.COMPLETED,
            },
            include: {
              gifter: true,
              receiver: true,
              adjective1: true,
              adjective2: true,
              adjective3: true,
              gameRoom: true,
            },
          });

          updatedAssignments.push(updated);
          console.info(
            `✅ Successfully generated gift images for ${assignment.receiver.name}`,
          );
        } catch (error) {
          console.error(
            "❌ Error processing assignment:",
            assignment.id,
            error,
          );
        }
      }

      return updatedAssignments;
    }),

  resetGiftGeneration: publicProcedure
    .input(
      z.object({
        gameRoomId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.assignment.updateMany({
          where: {
            gameRoomId: input.gameRoomId,
          },
          data: {
            giftIdeas: [],
            giftIdeaImages: [],
            status: AssignmentStatus.PENDING_GIFT_IDEAS,
          },
        });

        return { success: true };
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  getAssignment: publicProcedure
    .input(
      z.object({
        accessUrl: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.assignment.findFirst({
          where: { accessUrl: input.accessUrl },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  getByGifterId: publicProcedure
    .input(
      z.object({
        gifterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const assignment = await ctx.prisma.assignment.findFirst({
          where: { gifterId: input.gifterId },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
            gameRoom: true,
          },
        });

        if (!assignment) {
          throw new AppError("NOT_FOUND", "Assignment not found");
        }

        return assignment;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),
});
