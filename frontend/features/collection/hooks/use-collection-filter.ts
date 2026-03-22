"use client";

import { useDebouncedInput, useSearchParameters } from "@/foundations/hooks";
import { SearchParameterKeys } from "../definitions";

/**
 * マイスニペットのキーワード検索・言語フィルター・公開範囲フィルターのロジックを提供する
 */
export const useCollectionFilter = () => {
  const { get, update } = useSearchParameters({
    resetKeys: [SearchParameterKeys.Page],
  });

  const keyword = get(SearchParameterKeys.Keyword);
  const language = get(SearchParameterKeys.Language);
  const visibility = get(SearchParameterKeys.Visibility);

  const applyKeyword = (value: string) =>
    update(SearchParameterKeys.Keyword, value);

  const { inputValue, handleChange, handleClear } = useDebouncedInput(
    keyword,
    applyKeyword,
  );

  const toggleLanguage = (value: string) =>
    update(SearchParameterKeys.Language, language === value ? "" : value);

  const resetLanguage = () => update(SearchParameterKeys.Language, "");

  const toggleVisibility = (value: string) =>
    update(SearchParameterKeys.Visibility, visibility === value ? "" : value);

  const resetVisibility = () => update(SearchParameterKeys.Visibility, "");

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
    visibility: {
      value: visibility,
      onSelect: toggleVisibility,
      onReset: resetVisibility,
    },
  };
};
