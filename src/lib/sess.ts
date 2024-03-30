"use server";
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});

export const getServerSession = async (req: NextRequest) => {
  const authRequest = auth.handleRequest(req.method, context);
  return await authRequest.validate();
};
