"use client";

import Link from "next/link";
import { Routes } from "@/foundations/definitions";

/**
 * 予期しないエラーが発生した場合にリトライボタンと一覧への導線を表示する
 */
const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <span className="text-6xl font-bold text-ink-muted">Error</span>
      <p className="text-sm text-ink-secondary">{error.message}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors duration-150 hover:bg-accent/90"
        >
          もう一度試す
        </button>
        <Link
          href={Routes.Home}
          className="rounded-lg border border-edge px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-hover"
        >
          一覧に戻る
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
