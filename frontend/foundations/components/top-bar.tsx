"use client";

import Link from "next/link";
import { useLoginOverlay, useSessionStore } from "@/foundations/stores";
import { Account } from "@/features/onboarding/components/account";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * 画面上部に固定表示されるヘッダーバーを描画する
 */
export const TopBar = () => {
  const user = useSessionStore((state) => state.user);
  const open = useLoginOverlay((state) => state.open);

  return (
    <header className="sticky top-0 z-50 flex h-top-bar items-center justify-between border-b border-edge bg-surface-raised px-4">
      <Link href="/" className="font-mono text-sm font-bold text-ink">
        {"</SnipShare>"}
      </Link>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        {user ? (
          <Account />
        ) : (
          <button
            type="button"
            onClick={open}
            className="rounded-md px-3 py-1 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
          >
            ログイン
          </button>
        )}
      </div>
    </header>
  );
};
