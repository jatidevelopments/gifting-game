import { db as prisma } from "./db";
import { type IncomingHttpHeaders } from "http";

export interface Context {
  prisma: typeof prisma;
  headers: IncomingHttpHeaders;
}

export function createContext(opts: { headers: IncomingHttpHeaders }): Context {
  return {
    prisma,
    headers: opts.headers,
  };
}
