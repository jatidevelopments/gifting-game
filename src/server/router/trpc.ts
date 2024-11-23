import { initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { db as prisma } from '../db';
import { AppError } from './errors';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {
    prisma,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof AppError
            ? null
            : error.code === 'BAD_REQUEST' && 'zodError' in error
            ? error.zodError
            : null,
      },
    };
  },
});

export const createRouter = t.router;
export const publicProcedure = t.procedure;
