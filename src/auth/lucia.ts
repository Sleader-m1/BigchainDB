import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { ioredis } from "@lucia-auth/adapter-session-redis";
import { prisma as p } from "@/lib/prismaClient";
import { redis } from "@/lib/redisClient";

export const auth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  adapter: {
    user: prisma(p),
    session: ioredis(redis),
  },
  getUserAttributes: (data) => {
    return {
      role: data.role,
      organisationId: data.organisationId,
      email: data.email,
      fio: data.fio,
    };
  },
  csrfProtection: false
});

export type Auth = typeof auth;
