"use client";

import { useDismiss } from "@/foundations/hooks/use-dismiss";
import { useOverlayStore } from "@/foundations/stores";
import { LoginContent } from "./login-content";

/**
 * ログインのオーバーレイを表示する
 */
export const LoginOverlay = () => {
  const isOpen = useOverlayStore((state) => state.isOpen);
  const close = useOverlayStore((state) => state.close);
  const contentRef = useDismiss<HTMLDivElement>(isOpen, close);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div ref={contentRef}>
        <LoginContent />
      </div>
    </div>
  );
};
