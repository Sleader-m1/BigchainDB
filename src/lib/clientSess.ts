"use client";

import { Session } from "lucia";
import { useEffect, useState } from "react";
import { getPageSession } from "./sess";
import { useRouter } from "next/navigation";

export const useSignOut = () => {
  const [signedOut, setSignedOut] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (signedOut === true) {
      fetch("/api/auth/logout", { method: "POST" }).finally(() =>
        router.push("/auth/login")
      );
    }
  }, [signedOut]);
  function signOut() {
    setSignedOut(true);
  }
  return { signOut };
};

export const useSession = () => {
  const [data, setData] = useState<Session>(null);
  useEffect(() => {
    getPageSession().then((r) => setData(r));
  }, []);
  return data;
};
