import { LanguageOptions, type Language } from "@/foundations/definitions";

/**
 * 言語識別子をUIに表示するラベルに変換する
 */
export const toLanguageLabel = (language: Language): string => {
  return (
    LanguageOptions.find((option) => option.value === language)?.label ??
    language
  );
};
