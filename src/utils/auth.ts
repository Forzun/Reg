// src/utils/auth.ts
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { prisma } from "../prisma";

export const auth = betterAuth({
  baseURL: 'http://localhost:3005',
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
  },

});
