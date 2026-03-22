import Link from "next/link";
import { Routes } from "@/foundations/definitions";

/**
 * スニペットが見つからない場合にエラーコードと一覧への導線を表示する
 */
export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <span className="text-6xl font-bold text-ink-muted">404</span>
      <p className="text-sm text-ink-secondary">
        このスニペットは見つかりませんでした
      </p>
      <Link
        href={Routes.Home}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors duration-150 hover:bg-accent/90"
      >
        一覧に戻る
      </Link>
    </div>
  );
};
