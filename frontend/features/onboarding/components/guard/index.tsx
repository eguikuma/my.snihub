import type { ReactNode } from "react";
import { NoiseTexture } from "@/foundations/components/noise-texture";
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
        <NoiseTexture />
        <div className="relative z-10">
          <LoginContent />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
