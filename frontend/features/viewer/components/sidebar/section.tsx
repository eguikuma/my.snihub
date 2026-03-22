import type { ReactNode } from "react";

type SectionProps = {
  heading: string;
  children: ReactNode;
};

/**
 * 見出し付きのサイドバーセクションを表示する
 */
export const Section = ({ heading, children }: SectionProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-xs font-medium text-ink-muted">{heading}</h2>
    {children}
  </section>
);
