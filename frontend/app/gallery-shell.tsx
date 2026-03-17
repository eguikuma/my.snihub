"use client";

import { CommandPalette } from "@/features/gallery/components/command-palette";

type GalleryShellProps = {
  children: React.ReactNode;
};

/**
 * ギャラリー画面のクライアント境界を担い、コマンドパレットと子要素を配置する
 */
export const GalleryShell = ({ children }: GalleryShellProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
      <CommandPalette />
      {children}
    </div>
  );
};
