"use client";

import { useSearchInput, useSearchParameters } from "@/foundations/hooks";
import { SearchParameterKeys } from "../definitions";

/**
 * ギャラリーのキーワード検索と言語フィルターのロジックを提供する
 */
export const useGalleryFilter = () => {
  const { get, update, isPending } = useSearchParameters({
    resetKeys: [SearchParameterKeys.Page],
  });

  const keyword = get(SearchParameterKeys.Keyword);
  const language = get(SearchParameterKeys.Language);

  const applyKeyword = (value: string) =>
    update(SearchParameterKeys.Keyword, value);

  const {
    inputValue,
    handleChange,
    handleSubmit,
    handleClear,
    handleCompositionStart,
    handleCompositionEnd,
  } = useSearchInput(keyword, applyKeyword);

  const toggleLanguage = (value: string) =>
    update(SearchParameterKeys.Language, language === value ? "" : value);

  const resetLanguage = () => update(SearchParameterKeys.Language, "");

  const changePage = (page: number) =>
    update(SearchParameterKeys.Page, page > 1 ? String(page) : "");

  return {
    isPending,
    keyword: {
      value: inputValue,
      onChange: handleChange,
      onSubmit: handleSubmit,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onClear: handleClear,
    },
    language: {
      value: language,
      onSelect: toggleLanguage,
      onReset: resetLanguage,
    },
    page: {
      onChange: changePage,
    },
  };
};
