import Link from "next/link";
import type { ReactNode } from "react";

type LinkItemProps = {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
};

/**
 * アイコン付きのリンクメニュー項目を表示する
 */
export const LinkItem = ({ href, icon, children, onClick }: LinkItemProps) => (
  <Link
    href={href as never}
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
  >
    {icon}
    {children}
  </Link>
);
