import { db as prisma } from "./db";

export interface Context {
  prisma: typeof prisma;
}

export function createContext(): Context {
  return {
    prisma,
  };
}
