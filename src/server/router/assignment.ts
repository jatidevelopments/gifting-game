import { z } from 'zod';
import { createRouter, publicProcedure } from './trpc';
import { AppError, handlePrismaError } from './errors';
import type { AssignmentWithRelations } from './types';
import { shuffle } from './utils';
import type { Prisma } from '@prisma/client';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createWordTriplets(adjectives: any[], numParticipants: number) {
  // Group adjectives by category for reference
  const adjectivesByCategory = adjectives.reduce((acc, adj) => {
    const categoryName = adj.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(adj.word);
    return acc;
  }, {} as Record<string, string[]>);

  // Create a prompt that explains the task and provides context
  const prompt = `As a Secret Santa gift exchange assistant, create ${numParticipants} sets of 3 descriptive words each. Each set should work well together to inspire meaningful gift ideas.

Available words by category:
${Object.entries(adjectivesByCategory)
  .map(([category, words]: any) => `${category}: ${words.join(', ')}`)
  .join('\n')}

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
      model: "gpt-3.5-turbo",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(response);

   console.log('Generated word triplets:', JSON.stringify(parsedResponse, null, 2));

    // Map the word strings back to adjective objects
    const wordToAdjective = new Map(adjectives.map(adj => [adj.word, adj]));

    return parsedResponse.wordSets.map((set: { words: string[] }) =>
      set.words.map(word => {
        const adjective = wordToAdjective.get(word);
        if (!adjective) {
          throw new Error(`Word "${word}" not found in original adjectives list`);
        }
        return adjective;
      })
    );
  } catch (error) {
    console.error('Error creating word triplets:', error);
    throw new Error('Failed to generate word combinations');
  }
}

export const assignmentRouter = createRouter({
  getResults: publicProcedure
    .input(z.object({
      gameRoomId: z.string().uuid()
    }))
    .query(async ({ ctx, input }): Promise<AssignmentWithRelations[]> => {
      try {
        return await ctx.prisma.assignment.findMany({
          where: {
            gameRoomId: input.gameRoomId
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
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  getAssignment: publicProcedure
    .input(z.object({ 
      accessUrl: z.string()
    }))
    .query(async ({ ctx, input }): Promise<AssignmentWithRelations | null> => {
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

  generateAssignments: publicProcedure
    .input(z.object({
      gameRoomId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
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
          throw new AppError('NOT_FOUND', 'Game room not found');
        }

        // Check if there are enough participants
        if (gameRoom.participants.length < 2) {
          throw new AppError('BAD_REQUEST', 'At least 2 participants are required for assignment generation');
        }

        // Check if there are enough adjectives
        const requiredAdjectives = gameRoom.participants.length * 3;
        if (gameRoom.adjectives.length < requiredAdjectives) {
          throw new AppError('BAD_REQUEST', `At least ${requiredAdjectives} magic words are required for assignment generation`);
        }

        // Delete existing assignments
        await ctx.prisma.assignment.deleteMany({
          where: { gameRoomId: input.gameRoomId },
        });

        // Generate word triplets using OpenAI
        const wordTriplets = await createWordTriplets(
          gameRoom.adjectives,
          gameRoom.participants.length
        );

        // Generate new assignments
        const participants = [...gameRoom.participants];
        const shuffledParticipants = shuffle(participants);

        const assignments: Prisma.AssignmentCreateManyInput[] = [];
        for (let i = 0; i < participants.length; i++) {
          const gifter = shuffledParticipants[i];
          const receiver = shuffledParticipants[(i + 1) % participants.length];
          const [adj1, adj2, adj3] = wordTriplets[i] || [];

          // Verify all required objects exist
          if (!gifter || !receiver || !adj1 || !adj2 || !adj3) {
            throw new AppError('BAD_REQUEST', 'Invalid participant or adjective data');
          }

          assignments.push({
            gifterId: gifter.id,
            receiverId: receiver.id,
            adjective1Id: adj1.id,
            adjective2Id: adj2.id,
            adjective3Id: adj3.id,
            gameRoomId: input.gameRoomId,
          });
        }

        // Create all assignments
        return await ctx.prisma.assignment.createMany({
          data: assignments,
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),

  getByGifterId: publicProcedure
    .input(z.object({
      gifterId: z.string(),
    }))
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
          throw new AppError('NOT_FOUND', 'Assignment not found');
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
