"use client";

import type { Statistics } from "../actions/fetch-statistics";
import { CommandPalette } from "./command-palette";

type CollectionContainerProps = {
  statistics: Statistics;
  children: React.ReactNode;
};

/**
 * マイスニペット画面のクライアント境界を担い、コマンドパレットと子要素を配置する
 */
export const CollectionContainer = ({
  statistics,
  children,
}: CollectionContainerProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
      <CommandPalette statistics={statistics} />
      {children}
    </div>
  );
};
