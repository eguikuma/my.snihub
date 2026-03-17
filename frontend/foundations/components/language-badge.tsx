import type { Language } from "@/foundations/definitions";
import { toLanguageLabel } from "@/foundations/libraries/language";

type LanguageBadgeProps = {
  language: Language;
};

/**
 * プログラミング言語名とカラーをバッジとして表示する
 */
export const LanguageBadge = ({ language }: LanguageBadgeProps) => (
  <span className="w-fit rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs text-ink-secondary">
    {toLanguageLabel(language)}
  </span>
);
