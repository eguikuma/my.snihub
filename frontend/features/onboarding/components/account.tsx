"use client";

import { User } from "@/foundations/schemas";
import { useLogout } from "../hooks";

type AccountProps = {
  user: User;
};

/**
 * 認証済みユーザーのアバターとログアウト操作を提供する
 */
export const Account = ({ user }: AccountProps) => {
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="text-sm text-ink-secondary transition-colors hover:text-ink disabled:opacity-50"
      >
        ログアウト
      </button>
    </div>
  );
};
