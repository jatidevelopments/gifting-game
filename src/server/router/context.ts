import { inferAsyncReturnType } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import * as trpcNext from '@trpc/server/adapters/next';

const prisma = new PrismaClient();

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  return {
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
