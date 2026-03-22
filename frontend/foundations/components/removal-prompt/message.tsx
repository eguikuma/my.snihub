import type { ReactNode } from "react";

type MessageProps = {
  heading: string;
  children: ReactNode;
  supplement?: string;
};

/**
 * 削除対象の見出し・本文・補足テキストをセンター配置で表示する
 */
export const Message = ({ heading, children, supplement }: MessageProps) => (
  <div className="flex flex-col gap-2 text-center">
    <h2 className="text-lg font-bold text-ink">{heading}</h2>
    <p className="text-sm text-ink-secondary">{children}</p>
    {supplement && <p className="text-xs text-ink-muted">{supplement}</p>}
  </div>
);
