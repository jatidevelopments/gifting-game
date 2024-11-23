import { z } from 'zod';
import { createRouter, publicProcedure } from './trpc';
import type { ParticipantWithAssignments } from './types';
import { AppError, handlePrismaError } from './errors';

export const participantRouter = createRouter({
  getAll: publicProcedure
    .input(z.object({ 
      gameRoomId: z.string().uuid()
    }))
    .query(async ({ ctx, input }): Promise<ParticipantWithAssignments[]> => {
      try {
        return await ctx.prisma.participant.findMany({
          where: { gameRoomId: input.gameRoomId },
          include: {
            givenAssignments: true,
            receivedAssignments: true,
          },
        });
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
      gameRoomId: z.string().uuid()
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

        // Check participant limit
        const participantCount = await ctx.prisma.participant.count({
          where: { gameRoomId: input.gameRoomId },
        });

        if (participantCount >= 100) {
          throw new AppError('BAD_REQUEST', 'Maximum number of participants (100) reached');
        }

        // Check if participant name already exists in this game room
        const existingParticipant = await ctx.prisma.participant.findFirst({
          where: {
            name: input.name,
            gameRoomId: input.gameRoomId
          }
        });

        if (existingParticipant) {
          throw new AppError('BAD_REQUEST', 'A participant with this name already exists in this game');
        }

        // Create the participant
        return await ctx.prisma.participant.create({
          data: {
            name: input.name.trim(),
            gameRoomId: input.gameRoomId,
          },
          include: {
            givenAssignments: true,
            receivedAssignments: true,
          },
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
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
        // Check if participant exists and belongs to the game room
        const participant = await ctx.prisma.participant.findFirst({
          where: { 
            id: input.id,
            gameRoomId: input.gameRoomId
          },
        });

        if (!participant) {
          throw new AppError('NOT_FOUND', 'Participant not found in this game room');
        }

        return await ctx.prisma.participant.delete({
          where: { id: input.id },
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),

  clearAllParticipants: publicProcedure
    .input(z.object({ 
      gameRoomId: z.string().uuid()
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

        return await ctx.prisma.participant.deleteMany({
          where: { gameRoomId: input.gameRoomId },
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw handlePrismaError(error);
      }
    }),

  verifyPin: publicProcedure
    .input(z.object({
      participantId: z.string().uuid(),
      pin: z.string().min(4).max(8),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const participant = await ctx.prisma.participant.findUnique({
          where: { id: input.participantId },
          select: {
            id: true,
            pin: true,
            hasAccessed: true,
          },
        });

        if (!participant) {
          throw new AppError('NOT_FOUND', 'Participant not found');
        }

        if (!participant.pin) {
          throw new AppError('BAD_REQUEST', 'PIN not set for this participant');
        }

        const isValid = participant.pin === input.pin;

        if (isValid) {
          await ctx.prisma.participant.update({
            where: { id: input.participantId },
            data: { hasAccessed: true },
          });
        }

        return {
          isValid,
          hasAccessed: participant.hasAccessed,
        };
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),

  setPin: publicProcedure
    .input(z.object({
      participantId: z.string().uuid(),
      pin: z.string().min(4).max(8),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const participant = await ctx.prisma.participant.findUnique({
          where: { id: input.participantId },
        });

        if (!participant) {
          throw new AppError('NOT_FOUND', 'Participant not found');
        }

        if (participant.pin) {
          throw new AppError('BAD_REQUEST', 'PIN has already been set');
        }

        const updatedParticipant = await ctx.prisma.participant.update({
          where: { id: input.participantId },
          data: {
            pin: input.pin,
            hasAccessed: true,
          },
        });

        return updatedParticipant;
      } catch (error) {
        throw handlePrismaError(error);
      }
    }),
});
