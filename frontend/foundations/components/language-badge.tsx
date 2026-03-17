import { LanguageOptions, type Language } from "@/foundations/definitions";

type LanguageBadgeProps = {
  language: Language;
};

/**
 * プログラミング言語名とカラーをバッジとして表示する
 */
export const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  const languageOption = LanguageOptions.find(
    ({ value }) => value === language,
  );
  const languageLabel = languageOption?.label ?? language;

  return (
    <span className="w-fit rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs text-ink-secondary">
      {languageLabel}
    </span>
  );
};
