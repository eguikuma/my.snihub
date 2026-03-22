"use client";

import { LanguageChips } from "@/foundations/components/language-chips";
import { SearchInput } from "@/foundations/components/search-input";
import { useDebouncedInput, useSearchParameters } from "@/foundations/hooks";
import type { Statistics } from "../actions/fetch-my-snippet-statistics";
import { SearchParameterKeys } from "../definitions";
import { VisibilityTabs } from "./visibility-tabs";

type CommandPaletteProps = {
  statistics: Statistics;
};

/**
 * キーワード検索・言語フィルター・公開範囲タブを組み合わせたマイスニペットの操作パネルを提供する
 */
export const CommandPalette = ({ statistics }: CommandPaletteProps) => {
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
      <VisibilityTabs
        visibility={visibility}
        statistics={statistics}
        onSelect={toggleVisibility}
        onReset={resetVisibility}
      />
    </div>
  );
};
