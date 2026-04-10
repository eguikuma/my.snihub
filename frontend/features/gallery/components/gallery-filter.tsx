"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { LanguageChips } from "@/foundations/components/language-chips";
import { SearchInput } from "@/foundations/components/search-input";
import { PaginationProvider } from "../contexts";
import { useGalleryFilter } from "../hooks";
import { GalleryShell } from "./gallery-shell";

type GalleryFilterProps = {
  children: ReactNode;
};

/**
 * ギャラリー画面のクライアント境界を担い、フィルターパネルと子要素を配置する
 */
export const GalleryFilter = ({ children }: GalleryFilterProps) => {
  const { isPending, keyword, language, page } = useGalleryFilter();

  const paginationValue = { isPending, onPageChange: page.onChange };

  return (
    <GalleryShell.Root>
      <GalleryShell.FilterPanel>
        <SearchInput
          value={keyword.value}
          disabled={isPending}
          onChange={keyword.onChange}
          onSubmit={keyword.onSubmit}
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
      </GalleryShell.FilterPanel>
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
    </GalleryShell.Root>
  );
};
