import { auth } from "@/auth/lucia";

export default async function getUser(
  token: string | null,
  sessionInfo: object | null
) {
  try {
    if (token == null && sessionInfo == null) {
      throw new Error("Нет токена и сессии");
    }
    if (sessionInfo) {
      return {
        user: {
          ///user info
        },
      };
    } else {
      if (token == null) {
        throw new Error("Нет токена и сессии");
      }
      const session = await auth.validateSession(token.split(" ")[1]);
      const res = { user: await auth.getUser(session.user.userId) };
      if (!res) throw new Error("Не авторизован");
      return res;
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
}