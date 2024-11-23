import { z } from 'zod';
import { createRouter, publicProcedure } from './trpc';
import { AppError, handlePrismaError } from './errors';

export const gameRoomRouter = createRouter({
  create: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        return await ctx.prisma.gameRoom.create({
          data: {}
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  getByCode: publicProcedure
    .input(z.object({ code: z.string().min(1, 'Game code is required') }))
    .query(async ({ ctx, input }) => {
      try {
        const gameRoom = await ctx.prisma.gameRoom.findUnique({
          where: { code: input.code },
          include: {
            participants: true,
            adjectives: {
              include: {
                category: true,
              },
            },
            assignments: {
              include: {
                gifter: true,
                receiver: true,
                adjective1: true,
                adjective2: true,
                adjective3: true,
                gameRoom: true,
              },
            },
          },
        });

        if (!gameRoom) {
          throw new AppError('NOT_FOUND', 'Game room not found');
        }

        return gameRoom;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid('Invalid game room ID') }))
    .query(async ({ ctx, input }) => {
      try {
        const gameRoom = await ctx.prisma.gameRoom.findUnique({
          where: { id: input.id },
          include: {
            participants: true,
            adjectives: {
              include: {
                category: true,
              },
            },
            assignments: {
              include: {
                gifter: true,
                receiver: true,
                adjective1: true,
                adjective2: true,
                adjective3: true,
                gameRoom: true,
              },
            },
          },
        });

        if (!gameRoom) {
          throw new AppError('NOT_FOUND', 'Game room not found');
        }

        return gameRoom;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),
});
