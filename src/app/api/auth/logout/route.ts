import { auth } from "@/auth/lucia";
import * as context from "next/headers";

import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (!session) {
    return new NextResponse(null, {
      status: 401,
    });
  }
  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/auth/login", // redirect to login page
    },
  });
};
