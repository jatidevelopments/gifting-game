import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import OpenAI from 'openai';
import { env } from "../../env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const t = initTRPC.context<Context>().create();

export const createRouter = t.router;
export const publicProcedure = t.procedure;

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i]!;
    newArray[i] = newArray[j]!;
    newArray[j] = temp;
  }
  return newArray;
}

type ParticipantWithAssignments = Prisma.ParticipantGetPayload<{
  include: {
    assignments: true;
  };
}>;

type AdjectiveWithCategory = Prisma.AdjectiveGetPayload<{
  include: {
    category: true;
  };
}>;

type AssignmentWithRelations = Prisma.AssignmentGetPayload<{
  include: {
    gifter: true;
    receiver: true;
    adjective1: true;
    adjective2: true;
    adjective3: true;
  };
}>;

type CreateAssignmentData = {
  gifterId: number;
  receiverId: number;
  adjective1Id: number;
  adjective2Id: number;
  adjective3Id: number;
};

export const participantRouter = createRouter({
  getAll: publicProcedure.query(async ({ ctx }): Promise<ParticipantWithAssignments[]> => {
    return await ctx.prisma.participant.findMany({
      include: { assignments: true },
    });
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }): Promise<Prisma.ParticipantGetPayload<{}>> => {
      return await ctx.prisma.participant.create({
        data: { name: input.name },
      });
    }),

  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }): Promise<ParticipantWithAssignments> => {
      return await ctx.prisma.participant.create({
        data: {
          name: input.name,
        },
        include: { assignments: true },
      });
    }),

  setPin: publicProcedure
    .input(z.object({
      participantId: z.number(),
      pin: z.string().min(4).max(8),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.participant.update({
        where: { id: input.participantId },
        data: {
          pin: input.pin,
          hasAccessed: true,
        },
      });
    }),

  verifyPin: publicProcedure
    .input(z.object({
      participantId: z.number(),
      pin: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const participant = await ctx.prisma.participant.findUnique({
        where: { id: input.participantId },
      });

      if (!participant) {
        throw new Error('Participant not found');
      }

      if (participant.pin !== input.pin) {
        throw new Error('Invalid PIN');
      }

      return participant;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }): Promise<Prisma.ParticipantGetPayload<{}>> => {
      // First delete any assignments involving this participant
      await ctx.prisma.assignment.deleteMany({
        where: {
          OR: [
            { gifterId: input.id },
            { receiverId: input.id }
          ]
        }
      });

      return await ctx.prisma.participant.delete({
        where: { id: input.id },
      });
    }),

  clearAllParticipants: publicProcedure.mutation(async ({ ctx }) => {
    // First delete all assignments
    await ctx.prisma.assignment.deleteMany({});
    
    // Then delete all participants
    return await ctx.prisma.participant.deleteMany({});
  }),
});

export const adjectiveRouter = createRouter({
  getAll: publicProcedure.query(async ({ ctx }): Promise<AdjectiveWithCategory[]> => {
    return await ctx.prisma.adjective.findMany({
      include: { category: true },
    });
  }),

  add: publicProcedure
    .input(z.object({
      word: z.string(),
      categoryId: z.number(),
    }))
    .mutation(async ({ ctx, input }): Promise<AdjectiveWithCategory> => {
      return await ctx.prisma.adjective.create({
        data: {
          word: input.word,
          categoryId: input.categoryId,
        },
        include: { category: true },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // First delete any assignments using this adjective
      await ctx.prisma.assignment.deleteMany({
        where: {
          OR: [
            { adjective1Id: input.id },
            { adjective2Id: input.id },
            { adjective3Id: input.id }
          ]
        }
      });

      return await ctx.prisma.adjective.delete({
        where: { id: input.id },
        include: { category: true },
      });
    }),

  clearAll: publicProcedure.mutation(async ({ ctx }) => {
    // First delete all assignments that use any adjectives
    await ctx.prisma.assignment.deleteMany();
    
    // Then delete all adjectives
    return await ctx.prisma.adjective.deleteMany({});
  }),

  generateForAllCategories: publicProcedure.mutation(async ({ ctx }) => {
    const participants = await ctx.prisma.participant.findMany();
    const categories = await ctx.prisma.category.findMany();
    const adjectivesPerCategory = participants.length * 3; // 3 adjectives per participant

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const results = [];
    
    for (const category of categories) {
      const prompt = `Generate ${adjectivesPerCategory} unique, positive, age-appropriate adjectives for the category "${category.name}". Requirements:
- Each adjective must be a single word
- All lowercase letters only
- No punctuation at all (no periods, commas, etc)
- Return as a simple comma-separated list with no extra spaces
Example format: happy, creative, gentle, kind

Your response:`;
      
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0]?.message?.content || "";
      const adjectives = response
        .split(",")
        .map(adj => adj.trim().toLowerCase().replace(/[^a-z]/g, ''))
        .filter(Boolean);

      // Create adjectives in the database
      for (const word of adjectives) {
        try {
          const result = await ctx.prisma.adjective.create({
            data: {
              word,
              categoryId: category.id,
            },
            include: {
              category: true,
            },
          });
          results.push(result);
        } catch (error: any) {
          // Skip duplicates
          if (error?.code !== 'P2002') throw error;
        }
      }
    }

    return results;
  }),

  generate: publicProcedure
    .input(z.object({
      categoryId: z.number(),
      count: z.number().min(1).max(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const categories = {
        1: "personality traits",
        2: "physical appearance traits",
        3: "skill-related traits",
      };

      const categoryName = categories[input.categoryId as keyof typeof categories];

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates adjectives for a gift exchange game. Generate only single-word adjectives that are positive and appropriate for all ages."
            },
            {
              role: "user",
              content: `Generate ${input.count} unique, positive ${categoryName} adjectives. Respond with only the adjectives separated by commas, no other text.`
            }
          ],
        });

        const adjectives = completion.choices[0]?.message.content
          ?.split(',')
          .map(adj => adj.trim())
          .filter(adj => adj.length > 0) || [];

        const createdAdjectives = await Promise.all(
          adjectives.map(word =>
            ctx.prisma.adjective.create({
              data: {
                word,
                categoryId: input.categoryId,
              }
            })
          )
        );

        return createdAdjectives;
      } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate adjectives');
      }
    }),
});

export const categoryRouter = createRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),
});

export const assignmentRouter = createRouter({
  getResults: publicProcedure.query(async ({ ctx }): Promise<AssignmentWithRelations[]> => {
    return await ctx.prisma.assignment.findMany({
      include: {
        gifter: true,
        receiver: true,
        adjective1: true,
        adjective2: true,
        adjective3: true,
      },
    });
  }),

  getAssignment: publicProcedure
    .input(z.object({ accessUrl: z.string() }))
    .query(async ({ ctx, input }): Promise<AssignmentWithRelations | null> => {
      return await ctx.prisma.assignment.findFirst({
        where: { accessUrl: input.accessUrl },
        include: {
          gifter: true,
          receiver: true,
          adjective1: true,
          adjective2: true,
          adjective3: true,
        },
      });
    }),

  generateAssignments: publicProcedure.mutation(async ({ ctx }): Promise<AssignmentWithRelations[]> => {
    // Delete existing assignments
    await ctx.prisma.assignment.deleteMany();

    const participants = await ctx.prisma.participant.findMany();
    const adjectives = await ctx.prisma.adjective.findMany();
    const assignments: CreateAssignmentData[] = [];

    if (participants.length < 3) {
      throw new Error('At least 3 participants are required.');
    }

    if (adjectives.length < 3) {
      throw new Error('At least 3 adjectives are required.');
    }

    // Create assignments array
    for (let i = 0; i < participants.length; i++) {
      const gifter = participants[i];
      const receiver = participants[(i + 1) % participants.length];

      if (!gifter || !receiver) {
        throw new Error(`Invalid participant found at index ${i}`);
      }

      const randomAdjectives = shuffle(adjectives).slice(0, 3);

      if (randomAdjectives.length !== 3) {
        throw new Error('Failed to get 3 random adjectives');
      }

      const [adjective1, adjective2, adjective3] = randomAdjectives;

      if (!adjective1 || !adjective2 || !adjective3) {
        throw new Error('Invalid adjective found in random selection');
      }

      assignments.push({
        gifterId: gifter.id,
        receiverId: receiver.id,
        adjective1Id: adjective1.id,
        adjective2Id: adjective2.id,
        adjective3Id: adjective3.id,
      });
    }

    // Create assignments in database
    return await Promise.all(
      assignments.map((assignment) =>
        ctx.prisma.assignment.create({
          data: {
            gifter: { connect: { id: assignment.gifterId } },
            receiver: { connect: { id: assignment.receiverId } },
            adjective1: { connect: { id: assignment.adjective1Id } },
            adjective2: { connect: { id: assignment.adjective2Id } },
            adjective3: { connect: { id: assignment.adjective3Id } },
          },
          include: {
            gifter: true,
            receiver: true,
            adjective1: true,
            adjective2: true,
            adjective3: true,
          },
        })
      )
    );
  }),
});

export const appRouter = createRouter({
  participant: participantRouter,
  adjective: adjectiveRouter,
  assignment: assignmentRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
