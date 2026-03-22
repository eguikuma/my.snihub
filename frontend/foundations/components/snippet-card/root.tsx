import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import { isPast } from "date-fns";
import { toRelative } from "../../libraries/date";

type RootProps = {
  href: string;
  expiresAt: string | null;
  children: ReactNode;
};

/**
 * カード全体のリンクラッパーを提供し、有効期限バナーを表示する
 */
export const Root = ({ href, expiresAt, children }: RootProps) => {
  const isExpired = expiresAt !== null && isPast(new Date(expiresAt));

  return (
    <Link
      href={href as never}
      className="flex min-h-52 flex-col overflow-hidden rounded-lg border border-edge bg-surface-raised transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
    >
      <div
        className={clsx(
          "px-5 py-2 text-xs",
          isExpired ? "bg-danger/10 text-danger" : "bg-accent/10 text-accent",
        )}
      >
        {isExpired
          ? "このスニペットは期限切れです"
          : expiresAt
            ? `${toRelative(expiresAt)}に期限が切れます`
            : "このスニペットは無期限です"}
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">{children}</div>
    </Link>
  );
};
