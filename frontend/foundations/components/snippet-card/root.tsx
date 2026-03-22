import Link from "next/link";
import type { ReactNode } from "react";

type RootProps = {
  href: string;
  children: ReactNode;
};

/**
 * カード全体のリンクラッパーを提供する
 */
export const Root = ({ href, children }: RootProps) => (
  <Link
    href={href as never}
    className="flex min-h-52 flex-col justify-between rounded-lg border border-edge bg-surface-raised p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
  >
    {children}
  </Link>
);
