import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/backend/features/auth/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), usernameClient(), adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
