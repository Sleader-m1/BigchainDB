import { auth } from "@/auth/lucia";
import Form from "@/components/Form";
import { Button, Input } from "antd";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as context from "next/headers";
const Page = async () => {
  // const session = await getPageSession();
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-3xl font-semibold mb-4">Вход</h1>
        <Form action="/api/auth/login">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600">
              Логин
            </label>
            <Input
              autoComplete="username"
              size="large"
              name="username"
              id="username"
              className="w-full "
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Пароль
            </label>
            <Input
              autoComplete="current-password"
              size="large"
              type="password"
              name="password"
              id="password"
              className="w-full "
            />
          </div>
          <Button
            size="large"
            htmlType="submit"
            type="primary"
            className="w-full"
          >
            Продолжить
          </Button>
        </Form>
        <p className="mt-4 text-center">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Регистрация
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
