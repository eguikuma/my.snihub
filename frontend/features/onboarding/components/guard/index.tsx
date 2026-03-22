import type { ReactNode } from "react";
import { session } from "@/foundations/libraries/sessions";
import { GuardTrigger } from "./trigger";

type GuardProps = {
  children: ReactNode;
};

/**
 * 未認証ユーザーに対してログインオーバーレイを強制表示するラッパー
 */
export const Guard = async ({ children }: GuardProps) => {
  const currentSession = await session.get();

  if (!currentSession.token) {
    return <GuardTrigger />;
  }

  return <>{children}</>;
};
