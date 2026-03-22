import Link from "next/link";
import { fetchMe } from "@/features/onboarding/actions/fetch-me";
import { Account } from "@/features/onboarding/components/account";
import { Routes } from "../../definitions";
import { LoginButton } from "./login-button";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * 画面上部に固定表示されるヘッダーバーを描画する
 */
export const TopBar = async () => {
  const user = await fetchMe();

  return (
    <header className="sticky top-0 z-50 flex h-top-bar items-center justify-between border-b border-edge bg-surface-raised px-4">
      <Link
        href={Routes.Snippets}
        className="font-mono text-sm font-bold text-ink"
      >
        {"</SniHub>"}
      </Link>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        {user ? <Account user={user} /> : <LoginButton />}
      </div>
    </header>
  );
};
