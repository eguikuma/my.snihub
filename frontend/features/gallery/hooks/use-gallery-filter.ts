"use client";

import { useDebouncedInput, useSearchParameters } from "@/foundations/hooks";
import { SearchParameterKeys } from "../definitions";

/**
 * ギャラリーのキーワード検索と言語フィルターのロジックを提供する
 */
export const useGalleryFilter = () => {
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

  return {
    keyword: {
      value: inputValue,
      onChange: handleChange,
      onClear: handleClear,
    },
    language: {
      value: language,
      onSelect: toggleLanguage,
      onReset: resetLanguage,
    },
  };
};
