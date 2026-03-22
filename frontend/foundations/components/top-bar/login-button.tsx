"use client";

import { useLoginOverlay } from "@/foundations/stores";

/**
 * ログインボタン
 */
export const LoginButton = () => {
  const open = useLoginOverlay((state) => state.open);

  return (
    <button
      type="button"
      onClick={() => open()}
      className="rounded-md px-3 py-1 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
    >
      ログイン
    </button>
  );
};
