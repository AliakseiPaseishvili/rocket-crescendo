import { type NextRequest } from "next/server";

import { auth } from "@/backend/features/auth/auth";

type RouteContext = { params: Promise<Record<string, string>> };
type Handler = (req: NextRequest, ctx?: RouteContext) => Promise<Response>;

export function withAdminAuth(handler: Handler): Handler {
  return async (req, ctx) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, ctx);
  };
}
