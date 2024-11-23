import { z } from 'zod';
import { createRouter, publicProcedure } from './trpc';

export const categoryRouter = createRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      include: {
        adjectives: true
      }
    });
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required')
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.category.create({
        data: {
          name: input.name,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({
      id: z.string().uuid()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.category.delete({
        where: { id: input.id },
      });
    }),
});
