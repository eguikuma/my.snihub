import clsx from "clsx";
import type { PaginationMeta } from "../../schemas";
import { buildPageNumbers } from "./page-numbers";

type PaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isPending?: boolean;
};

/**
 * 現在のページ番号をもとに前後のページリンクと省略記号を描画する
 */
export const Pagination = ({
  meta,
  onPageChange,
  isPending = false,
}: PaginationProps) => {
  if (meta.last_page <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="ページネーション"
    >
      <button
        type="button"
        onClick={() => onPageChange(meta.current_page - 1)}
        disabled={isPending || meta.current_page <= 1}
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
            onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(meta.current_page + 1)}
        disabled={isPending || meta.current_page >= meta.last_page}
        className="rounded-md px-2.5 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-40"
      >
        次へ
      </button>
    </nav>
  );
};
