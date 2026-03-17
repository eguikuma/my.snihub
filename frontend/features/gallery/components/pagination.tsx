"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { PaginationMeta } from "@/foundations/schemas";
import { SearchParameterKeys } from "../definitions";

const VISIBLE_RANGE = 2;

type PaginationProps = {
  meta: PaginationMeta;
};

/**
 * 現在ページを中心に表示するページ番号の配列を生成し、省略部分をnullで表す
 */
const buildPageNumbers = (current: number, last: number): (number | null)[] => {
  const pageNumbers: (number | null)[] = [];

  const start = Math.max(2, current - VISIBLE_RANGE);
  const end = Math.min(last - 1, current + VISIBLE_RANGE);

  pageNumbers.push(1);

  if (start > 2) {
    pageNumbers.push(null);
  }

  for (let page = start; page <= end; page++) {
    pageNumbers.push(page);
  }

  if (end < last - 1) {
    pageNumbers.push(null);
  }

  if (last > 1) {
    pageNumbers.push(last);
  }

  return pageNumbers;
};

/**
 * 現在のページ番号をもとに前後のページリンクと省略記号を描画する
 */
export const Pagination = ({ meta }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      nextSearchParams.set(SearchParameterKeys.Page, String(page));
    } else {
      nextSearchParams.delete(SearchParameterKeys.Page);
    }

    const queryString = nextSearchParams.toString();

    router.push(queryString ? `?${queryString}` : "/");
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
          /* 省略記号 */
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-ink-muted"
          >
            ...
          </span>
        ) : (
          /* ページ番号ボタン */
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
