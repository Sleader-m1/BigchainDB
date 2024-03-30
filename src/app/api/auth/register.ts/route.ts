import { auth } from "@/auth/lucia";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import * as context from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email");
  const fio = formData.get("fio");
  const phone = formData.get("phone");

  if (
    typeof username !== "string" ||
    username.length < 4 ||
    username.length > 31
  ) {
    return NextResponse.json(
      {
        error: "Неверный логин",
      },
      {
        status: 400,
      }
    );
  }
  if (
    typeof password !== "string" ||
    password.length < 3 ||
    password.length > 30
  ) {
    return NextResponse.json(
      {
        error: "Неверный пароль",
      },
      {
        status: 400,
      }
    );
  }
  if (typeof email !== "string" || email.length < 4 || email.length > 31) {
    return NextResponse.json(
      {
        error: "Неверный E-mail",
      },
      {
        status: 400,
      }
    );
  }
  if (typeof phone !== "string" || phone.length < 4 || phone.length > 31) {
    return NextResponse.json(
      {
        error: "Неверный телефон",
      },
      {
        status: 400,
      }
    );
  }
  if (typeof fio !== "string" || fio.length < 6 || fio.length > 255) {
    return NextResponse.json(
      {
        error: "Неверный ФИО",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: username.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        username,
        email,
        fio,
        phone,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, context);

    authRequest.setSession(session);
    revalidatePath("/auth/register");
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log("e :>> ", e?.message);

    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        {
          error: "Логин или E-mail уже заняты",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
};
