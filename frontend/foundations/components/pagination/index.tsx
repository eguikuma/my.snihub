"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { PaginationMeta } from "@/foundations/schemas";
import { buildPageNumbers } from "./page-numbers";

const PAGE_KEY = "page";

type PaginationProps = {
  meta: PaginationMeta;
};

/**
 * 現在のページ番号をもとに前後のページリンクと省略記号を描画する
 */
export const Pagination = ({ meta }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      nextSearchParams.set(PAGE_KEY, String(page));
    } else {
      nextSearchParams.delete(PAGE_KEY);
    }

    const queryString = nextSearchParams.toString();

    router.push(
      (queryString ? `${pathname}?${queryString}` : pathname) as Route,
    );
  };

  if (meta.last_page <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="ページネーション"
    >
      <button
        type="button"
        onClick={() => navigateToPage(meta.current_page - 1)}
        disabled={meta.current_page <= 1}
        className="rounded-md px-2.5 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-40"
      >
        前へ
      </button>

      {buildPageNumbers(meta.current_page, meta.last_page).map((page, index) =>
        page === null ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-ink-muted"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => navigateToPage(page)}
            className={clsx(
              "min-w-[2rem] rounded-md px-2 py-1.5 text-sm transition-colors",
              page === meta.current_page
                ? "bg-accent font-bold text-surface"
                : "text-ink-secondary hover:bg-surface-hover",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => navigateToPage(meta.current_page + 1)}
        disabled={meta.current_page >= meta.last_page}
        className="rounded-md px-2.5 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-40"
      >
        次へ
      </button>
    </nav>
  );
};
