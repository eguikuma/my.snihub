"use client";

import { useMemo, type ReactNode } from "react";
import clsx from "clsx";
import { LanguageChips } from "@/foundations/components/language-chips";
import { SearchInput } from "@/foundations/components/search-input";
import type { Statistics } from "../actions/fetch-my-snippet-statistics";
import { PaginationProvider } from "../contexts";
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
  const { isPending, keyword, language, visibility, page } =
    useCollectionFilter();

  const paginationValue = useMemo(
    () => ({ isPending, onPageChange: page.onChange }),
    [isPending, page.onChange],
  );

  return (
    <CollectionShell.Root>
      <CollectionShell.FilterPanel>
        <SearchInput
          value={keyword.value}
          disabled={isPending}
          onChange={keyword.onChange}
          onCompositionStart={keyword.onCompositionStart}
          onCompositionEnd={keyword.onCompositionEnd}
          onClear={keyword.onClear}
        />
        <LanguageChips
          language={language.value}
          disabled={isPending}
          onSelect={language.onSelect}
          onReset={language.onReset}
        />
        <VisibilityTabs
          visibility={visibility.value}
          statistics={statistics}
          disabled={isPending}
          onSelect={visibility.onSelect}
          onReset={visibility.onReset}
        />
      </CollectionShell.FilterPanel>
      <PaginationProvider value={paginationValue}>
        <div
          className={clsx(
            "transition-opacity duration-200",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          {children}
        </div>
      </PaginationProvider>
    </CollectionShell.Root>
  );
};
