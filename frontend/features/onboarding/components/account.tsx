"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useDismiss, useToggle } from "@/foundations/hooks";
import type { User } from "@/foundations/schemas";
import { useLogout } from "../hooks";

type AccountProps = {
  user: User;
};

/**
 * アカウントのドロップダウンメニューを表示する
 */
export const Account = ({ user }: AccountProps) => {
  const { opened, close, toggle } = useToggle(false);
  const { handleLogout, isLoggingOut } = useLogout();
  const menuRef = useDismiss<HTMLDivElement>(opened, close);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1 rounded-full p-0.5 transition-colors hover:bg-surface-hover"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <div className="bg-accent text-xs font-bold text-white">
              user.name.charAt(0).toUpperCase()
            </div>
          )}
        </div>
        <ChevronDown size={14} className="text-ink-muted" />
      </button>

      {opened && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-edge bg-surface-raised py-1 shadow-lg">
          {/* ユーザー情報 */}
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-ink">{user.name}</p>
            {user.email && (
              <p className="text-xs text-ink-muted">{user.email}</p>
            )}
          </div>

          <div className="mx-2 border-t border-edge" />

          {/* マイスニペット */}
          <Link
            href="/snippets/mine"
            onClick={close}
            aria-disabled={isLoggingOut}
            className="block px-4 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
          >
            マイスニペット
          </Link>

          <div className="mx-2 border-t border-edge" />

          {/* ログアウト */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-2 text-left text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-50"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};
