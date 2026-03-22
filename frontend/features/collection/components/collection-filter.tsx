"use client";

import type { ReactNode } from "react";
import { LanguageChips } from "@/foundations/components/language-chips";
import { SearchInput } from "@/foundations/components/search-input";
import type { Statistics } from "../actions/fetch-my-snippet-statistics";
import { useCollectionFilter } from "../hooks";
import { CollectionShell } from "./collection-shell";
import { VisibilityTabs } from "./visibility-tabs";

type CollectionFilterProps = {
  statistics: Statistics;
  children: ReactNode;
};

/**
 * マイスニペット画面のクライアント境界を担い、フィルターパネルと子要素を配置する
 */
export const CollectionFilter = ({
  statistics,
  children,
}: CollectionFilterProps) => {
  const { keyword, language, visibility } = useCollectionFilter();

  return (
    <CollectionShell.Root>
      <CollectionShell.FilterPanel>
        <SearchInput
          value={keyword.value}
          onChange={keyword.onChange}
          onClear={keyword.onClear}
        />
        <LanguageChips
          language={language.value}
          onSelect={language.onSelect}
          onReset={language.onReset}
        />
        <VisibilityTabs
          visibility={visibility.value}
          statistics={statistics}
          onSelect={visibility.onSelect}
          onReset={visibility.onReset}
        />
      </CollectionShell.FilterPanel>
      {children}
    </CollectionShell.Root>
  );
};
