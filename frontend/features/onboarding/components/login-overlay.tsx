"use client";

import { NoiseTexture } from "@/foundations/components/noise-texture";
import { useDismiss, useScrollLock } from "@/foundations/hooks";
import { useOverlayStore } from "@/foundations/stores";
import { LoginContent } from "./login-content";

/**
 * ログインのオーバーレイを表示する
 */
export const LoginOverlay = () => {
  const isOpen = useOverlayStore((state) => state.isOpen);
  const close = useOverlayStore((state) => state.close);
  const contentRef = useDismiss<HTMLDivElement>(isOpen, close);
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <NoiseTexture />
      <div ref={contentRef} className="relative z-10">
        <LoginContent />
      </div>
    </div>
  );
};
