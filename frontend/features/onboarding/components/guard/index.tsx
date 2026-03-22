import type { ReactNode } from "react";
import { session } from "@/foundations/libraries/sessions";
import { LoginContent } from "../login-content";

type GuardProps = {
  children: ReactNode;
};

/**
 * 未認証ユーザーに対してログインオーバーレイを表示する
 */
export const Guard = async ({ children }: GuardProps) => {
  const currentSession = await session.get();

  if (!currentSession.token) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <LoginContent />
      </div>
    );
  }

  return <>{children}</>;
};
