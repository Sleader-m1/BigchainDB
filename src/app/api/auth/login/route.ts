import { auth } from "@/auth/lucia";
import { NextResponse } from "next/server";
import { LuciaError } from "lucia";
import * as context from "next/headers";

import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  if (
    typeof username !== "string" ||
    username.length < 1 ||
    username.length > 31
  ) {
    return NextResponse.json(
      {
        error: "Неверный формат логина",
      },
      {
        status: 400,
      }
    );
  }
  if (
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 255
  ) {
    return NextResponse.json(
      {
        error: "Неверный формат пароля",
      },
      {
        status: 400,
      }
    );
  }
  try {
    // find user by key
    // and validate password
    const key = await auth.useKey("username", username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, context);

    authRequest.setSession(session);
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/dashboard", // redirect to profile page
      },
    });
  } catch (e) {
    console.log("e :>> ", e);
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return NextResponse.json(
        {
          error: "Неверные данные",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Неизвестная ошибка",
      },
      {
        status: 500,
      }
    );
  }
};
