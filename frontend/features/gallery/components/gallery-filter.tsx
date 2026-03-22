"use client";

import type { ReactNode } from "react";
import { LanguageChips } from "@/foundations/components/language-chips";
import { SearchInput } from "@/foundations/components/search-input";
import { useGalleryFilter } from "../hooks";
import { GalleryShell } from "./gallery-shell";

type GalleryFilterProps = {
  children: ReactNode;
};

/**
 * ギャラリー画面のクライアント境界を担い、フィルターパネルと子要素を配置する
 */
export const GalleryFilter = ({ children }: GalleryFilterProps) => {
  const { keyword, language } = useGalleryFilter();

  return (
    <GalleryShell.Root>
      <GalleryShell.FilterPanel>
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
      </GalleryShell.FilterPanel>
      {children}
    </GalleryShell.Root>
  );
};
