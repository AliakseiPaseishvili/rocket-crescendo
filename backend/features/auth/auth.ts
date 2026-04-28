import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";

import prisma from "@/backend/prisma/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  user: {
    additionalFields: {
      lastName: { type: "string", required: false, fieldName: "lastName" },
      gender: { type: "string", required: false, fieldName: "gender" },
      birthdate: { type: "string", required: false, fieldName: "birthdate" },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
