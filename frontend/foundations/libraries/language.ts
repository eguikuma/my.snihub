import { LanguageOptions, Languages, type Language } from "../definitions";

const ValidLanguages: Set<string> = new Set(Object.values(Languages));

/**
 * 文字列が有効な言語識別子であればLanguage型として返し、無効なら undefined を返す
 */
export const toLanguage = (value: string): Language | undefined =>
  ValidLanguages.has(value) ? (value as Language) : undefined;

/**
 * 言語識別子をUIに表示するラベルに変換する
 */
export const toLanguageLabel = (language: Language): string => {
  return (
    LanguageOptions.find((option) => option.value === language)?.label ??
    language
  );
};
