"use client";

import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * 画面上部に固定表示されるヘッダーバーを描画する
 */
export const TopBar = () => (
  <header className="sticky top-0 z-50 flex h-top-bar items-center justify-between border-b border-edge bg-surface-raised px-4">
    <Link href="/" className="font-mono text-sm font-bold text-ink">
      {"</SnipShare>"}
    </Link>

    <div className="flex items-center gap-2">
      <ThemeSwitcher />

      <button
        type="button"
        className="rounded-md px-3 py-1 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
      >
        ログイン
      </button>
    </div>
  </header>
);
