"use client";

import { useDebouncedInput, useSearchParameters } from "@/foundations/hooks";
import { SearchParameterKeys } from "../definitions";
import { LanguageChips } from "./language-chips";
import { SearchInput } from "./search-input";

/**
 * キーワード検索と言語フィルターを組み合わせたギャラリーの操作パネルを提供する
 */
export const CommandPalette = () => {
  const { get, update } = useSearchParameters({
    resetKeys: [SearchParameterKeys.Page],
  });

  const keyword = get(SearchParameterKeys.Keyword);
  const language = get(SearchParameterKeys.Language);

  const applyKeyword = (value: string) =>
    update(SearchParameterKeys.Keyword, value);

  const { inputValue, handleChange, handleClear } = useDebouncedInput(
    keyword,
    applyKeyword,
  );

  const toggleLanguage = (value: string) =>
    update(SearchParameterKeys.Language, language === value ? "" : value);

  const resetLanguage = () => update(SearchParameterKeys.Language, "");

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={inputValue}
        onChange={handleChange}
        onClear={handleClear}
      />
      <LanguageChips
        language={language}
        onSelect={toggleLanguage}
        onReset={resetLanguage}
      />
    </div>
  );
};
