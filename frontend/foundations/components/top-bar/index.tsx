import Link from "next/link";
import { Routes } from "@/foundations/definitions";
import { fetchMe } from "@/features/onboarding/actions/fetch-me";
import { Account } from "@/features/onboarding/components/account";
import { LoginButton } from "./login-button";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * 画面上部に固定表示されるヘッダーバーを描画する
 */
export const TopBar = async () => {
  const user = await fetchMe();

  return (
    <header className="sticky top-0 z-50 flex h-top-bar items-center justify-between border-b border-edge bg-surface-raised px-4">
      <Link href={Routes.Home} className="font-mono text-sm font-bold text-ink">
        {"</SnipShare>"}
      </Link>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        {user ? <Account user={user} /> : <LoginButton />}
      </div>
    </header>
  );
};
