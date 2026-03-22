"use client";

import type { Statistics } from "@/features/collection/actions/fetch-statistics";
import { CommandPalette } from "@/features/collection/components/command-palette";

type CollectionShellProps = {
  statistics: Statistics;
  children: React.ReactNode;
};

/**
 * マイスニペット画面のクライアント境界を担い、コマンドパレットと子要素を配置する
 */
export const CollectionShell = ({
  statistics,
  children,
}: CollectionShellProps) => {
  return (
    <div className="flex flex-col gap-4 desktop:gap-6">
      <CommandPalette statistics={statistics} />
      {children}
    </div>
  );
};
