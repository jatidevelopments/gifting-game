import "server-only";

import { createTRPCProxyClient } from "@trpc/client";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    // Your links configuration here
  ],
});

/**
 * This is the primary way to use the tRPC API on the server.
 */
export const serverClient = cache(async () => {
  return createCaller(await createContext());
});