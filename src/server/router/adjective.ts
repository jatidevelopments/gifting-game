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

        const prompt = `As a Secret Santa gift exchange assistant, generate ${input.count} unique and descriptive adjectives for the category "${category.name}". These adjectives will be used to inspire and guide gift selections.

Category-specific guidelines for "${category.name}":
${category.name === 'color' ? `
- Focus on specific, vivid color descriptions
- Include both basic and sophisticated color terms
- Consider seasonal and festive colors
- Avoid overly technical color names
Example range: "crimson", "emerald", "golden", "pastel"` : ''}
${category.name === 'texture' ? `
- Describe tactile and physical qualities
- Include both comfort and material properties
- Focus on gift-appropriate textures
- Use easily understandable terms
Example range: "silky", "plush", "smooth", "woven"` : ''}
${category.name === 'style' ? `
- Focus on aesthetic and design qualities
- Include both classic and contemporary styles
- Consider different taste preferences
- Use universally understood terms
Example range: "modern", "vintage", "minimalist", "elegant"` : ''}
${category.name === 'mood' ? `
- Describe emotional qualities and atmosphere
- Include positive and uplifting terms
- Focus on gift-giving emotions
- Use clear emotional descriptors
Example range: "cheerful", "peaceful", "exciting", "cozy"` : ''}
${category.name === 'utility' ? `
- Focus on practical and functional aspects
- Include different types of usefulness
- Consider various lifestyle needs
- Use clear utility descriptors
Example range: "practical", "versatile", "efficient", "handy"` : ''}
${category.name === 'interest' ? `
- Describe hobby and activity-related qualities
- Include various interest areas
- Focus on engaging characteristics
- Use inspiring descriptors
Example range: "adventurous", "creative", "educational", "entertaining"` : ''}
${category.name === 'size' ? `
- Describe physical dimensions and proportions
- Include both absolute and relative terms
- Focus on gift-appropriate sizes
- Use easily understandable terms
Example range: "small", "medium", "large", "oversized"` : ''}

Requirements:
1. Generate exactly ${input.count} adjectives
2. Each adjective must be:
   - A single word
   - Appropriate for gift descriptions
   - Easy to understand for all ages
   - Positive or neutral in connotation
3. Avoid:
   - Duplicate or very similar words
   - Overly complex or technical terms
   - Negative or inappropriate terms
   - Compound words or phrases

Format:
- Return only the adjectives
- One adjective per line
- No numbers, bullets, or additional formatting
- All lowercase

The adjectives should inspire gift-givers and help them think creatively about their gift choices.`;

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that generates descriptive adjectives for gift recommendations. Always return adjectives one per line, all lowercase, no numbers or special characters."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 150,
          });

          const response = completion.choices[0]?.message?.content;
          if (!response) {
            console.error('Empty response from OpenAI');
            throw new AppError('INTERNAL_SERVER_ERROR', 'No response from OpenAI');
          }

          console.log('Raw OpenAI response:', response);

          const adjectives = response
            .split('\n')
            .map(adj => adj.trim().toLowerCase())
            .filter(adj => {
              // Validate each adjective
              const isValid = adj.length > 0 && 
                            adj.length <= 20 && // reasonable length
                            /^[a-z]+$/.test(adj) && // only letters
                            !adj.includes(' '); // single word
              
              if (!isValid) {
                console.log('Filtered out invalid adjective:', adj);
              }
              return isValid;
            })
            .slice(0, input.count);

          if (adjectives.length === 0) {
            console.error('No valid adjectives generated from response:', response);
            throw new AppError('INTERNAL_SERVER_ERROR', 'Failed to generate valid adjectives');
          }

          if (adjectives.length < input.count) {
            console.warn(`Generated only ${adjectives.length} valid adjectives out of ${input.count} requested`);
          }

          console.log('Validated adjectives:', adjectives);

          // Create all adjectives in a single transaction
          const createdAdjectives = await ctx.prisma.$transaction(
            adjectives.map(word => 
              ctx.prisma.adjective.create({
                data: {
                  word,
                  category: {
                    connect: { id: input.categoryId }
                  },
                  gameRoom: {
                    connect: { id: input.gameRoomId }
                  }
                },
                include: {
                  category: true,
                }
              })
            )
          );

          return createdAdjectives;
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

        const prompt = `As a Secret Santa gift exchange assistant, generate ${input.count} unique and descriptive adjectives for the category "${category.name}". These adjectives will be used to inspire and guide gift selections.

Category-specific guidelines for "${category.name}":
${category.name === 'color' ? `
- Focus on specific, vivid color descriptions
- Include both basic and sophisticated color terms
- Consider seasonal and festive colors
- Avoid overly technical color names
Example range: "crimson", "emerald", "golden", "pastel"` : ''}
${category.name === 'texture' ? `
- Describe tactile and physical qualities
- Include both comfort and material properties
- Focus on gift-appropriate textures
- Use easily understandable terms
Example range: "silky", "plush", "smooth", "woven"` : ''}
${category.name === 'style' ? `
- Focus on aesthetic and design qualities
- Include both classic and contemporary styles
- Consider different taste preferences
- Use universally understood terms
Example range: "modern", "vintage", "minimalist", "elegant"` : ''}
${category.name === 'mood' ? `
- Describe emotional qualities and atmosphere
- Include positive and uplifting terms
- Focus on gift-giving emotions
- Use clear emotional descriptors
Example range: "cheerful", "peaceful", "exciting", "cozy"` : ''}
${category.name === 'utility' ? `
- Focus on practical and functional aspects
- Include different types of usefulness
- Consider various lifestyle needs
- Use clear utility descriptors
Example range: "practical", "versatile", "efficient", "handy"` : ''}
${category.name === 'interest' ? `
- Describe hobby and activity-related qualities
- Include various interest areas
- Focus on engaging characteristics
- Use inspiring descriptors
Example range: "adventurous", "creative", "educational", "entertaining"` : ''}
${category.name === 'size' ? `
- Describe physical dimensions and proportions
- Include both absolute and relative terms
- Focus on gift-appropriate sizes
- Use easily understandable terms
Example range: "small", "medium", "large", "oversized"` : ''}

Requirements:
1. Generate exactly ${input.count} adjectives
2. Each adjective must be:
   - A single word
   - Appropriate for gift descriptions
   - Easy to understand for all ages
   - Positive or neutral in connotation
3. Avoid:
   - Duplicate or very similar words
   - Overly complex or technical terms
   - Negative or inappropriate terms
   - Compound words or phrases

Format:
- Return only the adjectives
- One adjective per line
- No numbers, bullets, or additional formatting
- All lowercase

The adjectives should inspire gift-givers and help them think creatively about their gift choices.`;

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that generates descriptive adjectives for gift recommendations. Always return adjectives one per line, all lowercase, no numbers or special characters."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 150,
          });

          const response = completion.choices[0]?.message?.content;
          if (!response) {
            console.error('Empty response from OpenAI');
            throw new AppError('INTERNAL_SERVER_ERROR', 'No response from OpenAI');
          }

          console.log('Raw OpenAI response:', response);

          const adjectives = response
            .split('\n')
            .map(adj => adj.trim().toLowerCase())
            .filter(adj => {
              // Validate each adjective
              const isValid = adj.length > 0 && 
                            adj.length <= 20 && // reasonable length
                            /^[a-z]+$/.test(adj) && // only letters
                            !adj.includes(' '); // single word
              
              if (!isValid) {
                console.log('Filtered out invalid adjective:', adj);
              }
              return isValid;
            })
            .slice(0, input.count);

          if (adjectives.length === 0) {
            console.error('No valid adjectives generated from response:', response);
            throw new AppError('INTERNAL_SERVER_ERROR', 'Failed to generate valid adjectives');
          }

          if (adjectives.length < input.count) {
            console.warn(`Generated only ${adjectives.length} valid adjectives out of ${input.count} requested`);
          }

          console.log('Validated adjectives:', adjectives);

          // Create all adjectives in a single transaction
          const createdAdjectives = await ctx.prisma.$transaction(
            adjectives.map(word => 
              ctx.prisma.adjective.create({
                data: {
                  word,
                  category: {
                    connect: { id: input.categoryId }
                  },
                  gameRoom: {
                    connect: { id: input.gameRoomId }
                  }
                },
                include: {
                  category: true,
                }
              })
            )
          );

          return createdAdjectives;
        } catch (error) {
          console.error('Error in generateForAllCategories:', error);
          if (error instanceof AppError) {
            throw error;
          }
          throw handlePrismaError(error);
        }
      } catch (error) {
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
