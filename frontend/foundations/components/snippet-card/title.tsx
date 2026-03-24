import type { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  trailing?: ReactNode;
};

/**
 * スニペットのタイトルを表示し、末尾にバッジ等を配置できる
 */
export const Title = ({ children, trailing }: TitleProps) => (
  <div className="flex items-start justify-between gap-2">
    <h3 className="line-clamp-2 break-words text-base font-bold text-ink">
      {children}
    </h3>
    {trailing}
  </div>
);
