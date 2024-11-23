import { z } from 'zod';
import { createRouter, publicProcedure } from './trpc';
import { AppError, handlePrismaError } from './errors';
import type { AssignmentWithRelations } from './types';
import { shuffle } from './utils';
import type { Prisma } from '@prisma/client';

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

        // Generate new assignments
        const participants = [...gameRoom.participants];
        const shuffledParticipants = shuffle(participants);
        const adjectives = shuffle(gameRoom.adjectives);

        const assignments: Prisma.AssignmentCreateManyInput[] = [];
        for (let i = 0; i < participants.length; i++) {
          const gifter = shuffledParticipants[i];
          const receiver = shuffledParticipants[(i + 1) % participants.length];

          // Get three unique adjectives
          const assignmentAdjectives = adjectives.slice(i * 3, (i + 1) * 3);
          if (assignmentAdjectives.length < 3) {
            throw new AppError('BAD_REQUEST', 'Not enough unique adjectives for all participants');
          }

          // Verify all required objects exist
          if (!gifter || !receiver) {
            throw new AppError('BAD_REQUEST', 'Invalid participant data');
          }

          const [adj1, adj2, adj3] = assignmentAdjectives;
          if (!adj1 || !adj2 || !adj3) {
            throw new AppError('BAD_REQUEST', 'Invalid adjective data');
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
