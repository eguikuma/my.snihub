"use client";

import { useEffect } from "react";
import type { User } from "@/foundations/schemas";
import { useSessionStore } from "@/foundations/stores";

type SessionHydratorClientProps = {
  user: User | null;
};

/**
 * サーバーから受け取ったユーザーをストアに注入する
 */
export const SessionHydratorClient = ({ user }: SessionHydratorClientProps) => {
  useEffect(() => {
    useSessionStore.getState().hydrate(user);
  }, [user]);

  return null;
};
