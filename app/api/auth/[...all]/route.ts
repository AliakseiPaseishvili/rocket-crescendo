import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/backend/features/auth/auth";

export const { GET, POST } = toNextJsHandler(auth);
