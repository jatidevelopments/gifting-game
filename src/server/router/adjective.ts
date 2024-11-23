import { z } from 'zod';
import { createRouter, publicProcedure } from './trpc';
import type { AdjectiveWithCategory } from './types';
import OpenAI from 'openai';
import { env } from "../../env.mjs";
import { AppError, handlePrismaError, handleOpenAIError } from './errors';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const adjectiveRouter = createRouter({
  getAll: publicProcedure
    .input(z.object({ 
      gameRoomId: z.string().uuid()
    }))
    .query(async ({ ctx, input }): Promise<AdjectiveWithCategory[]> => {
      try {
        return await ctx.prisma.adjective.findMany({
          where: { gameRoomId: input.gameRoomId },
          include: {
            category: true,
          },
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  generate: publicProcedure
    .input(z.object({
      categoryId: z.string().uuid(),
      gameRoomId: z.string().uuid(),
      count: z.number().optional().default(5)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if game room exists
        const gameRoom = await ctx.prisma.gameRoom.findUnique({
          where: { id: input.gameRoomId },
        });

        if (!gameRoom) {
          throw new AppError('NOT_FOUND', 'Game room not found');
        }

        const category = await ctx.prisma.category.findUnique({
          where: { id: input.categoryId },
        });

        if (!category) {
          throw new AppError('NOT_FOUND', 'Category not found');
        }

        if (input.count < 1 || input.count > 10) {
          throw new AppError('BAD_REQUEST', 'Count must be between 1 and 10');
        }

        const prompt = `Generate ${input.count} unique adjectives that are ${category.name}. 
          The adjectives should be appropriate for describing gifts in a gift exchange game.
          Return only the adjectives, one per line.`;

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          });

          const adjectives = completion.choices[0]?.message.content
            ?.split('\n')
            .map(adj => adj.trim())
            .filter(adj => adj.length > 0) ?? [];

          if (adjectives.length === 0) {
            throw new AppError('BAD_REQUEST', 'Failed to generate adjectives');
          }

          return await Promise.all(
            adjectives.map(async (adjective) => {
              try {
                return await ctx.prisma.adjective.create({
                  data: {
                    word: adjective,
                    categoryId: input.categoryId,
                    gameRoomId: input.gameRoomId,
                  },
                });
              } catch (error) {
                throw handlePrismaError(error);
              }
            })
          );
        } catch (error) {
          throw handleOpenAIError(error);
        }
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),

  generateForAllCategories: publicProcedure
    .input(z.object({
      categoryId: z.string(),
      gameRoomId: z.string().uuid(),
      count: z.number().min(1).max(10)
    }))
    .mutation(async ({ ctx, input }) => {

      console.log({categoryId: input.categoryId, gameRoomId: input.gameRoomId, count: input.count});

      try {
        // Check if game room exists
        const gameRoom = await ctx.prisma.gameRoom.findUnique({
          where: { id: input.gameRoomId },
        });

        if (!gameRoom) {
          throw new AppError('NOT_FOUND', 'Game room not found');
        }

        // Check if category exists
        const category = await ctx.prisma.category.findUnique({
          where: { id: input.categoryId },
          select: { id: true, name: true }
        });

        if (!category) {
          console.error('Category not found:', input.categoryId);
          throw new AppError('NOT_FOUND', `Category not found: ${input.categoryId}`);
        }

        console.log('Generating words for category:', { id: category.id, name: category.name });

        const prompt = `Generate exactly ${input.count} unique adjectives that are ${category.name}. 
          The adjectives should be appropriate for describing gifts in a gift exchange game.
          Return only the adjectives, one per line, without numbers or bullet points.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 100,
        });

        const adjectives = completion.choices[0]?.message.content
          ?.split('\n')
          .map(adj => adj.trim())
          .filter(adj => adj.length > 0)
          .slice(0, input.count) ?? [];

        if (adjectives.length === 0) {
          throw new AppError('INTERNAL_SERVER_ERROR', 'Failed to generate adjectives');
        }

        console.log('Generated adjectives:', adjectives);

        // Create all adjectives in a single transaction
        return await ctx.prisma.$transaction(
          adjectives.map((adjective) => 
            ctx.prisma.adjective.create({
              data: {
                word: adjective,
                categoryId: category.id, // Use the verified category.id
                gameRoomId: input.gameRoomId,
              },
            })
          )
        );
      } catch (error) {
        console.error('Error in generateForAllCategories:', error);
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),

  add: publicProcedure
    .input(z.object({
      word: z.string(),
      categoryId: z.string(),
      gameRoomId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }): Promise<AdjectiveWithCategory> => {
      try {
        return await ctx.prisma.adjective.create({
          data: {
            word: input.word,
            categoryId: input.categoryId,
            gameRoomId: input.gameRoomId,
          },
          include: { category: true },
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  delete: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      gameRoomId: z.string().uuid()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if adjective exists and belongs to the game room
        const adjective = await ctx.prisma.adjective.findFirst({
          where: { 
            id: input.id,
            gameRoomId: input.gameRoomId
          },
        });

        if (!adjective) {
          throw new AppError('NOT_FOUND', 'Adjective not found in this game room');
        }

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
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  clearAll: publicProcedure
    .input(z.object({
      gameRoomId: z.string().uuid()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First delete all assignments that use any adjectives in this game room
        await ctx.prisma.assignment.deleteMany({
          where: { gameRoomId: input.gameRoomId }
        });
        
        // Then delete all adjectives in this game room
        return await ctx.prisma.adjective.deleteMany({
          where: { gameRoomId: input.gameRoomId }
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),
});
