"use client";

import { startTransition, useCallback, type ReactNode } from "react";
import type { Slug } from "@/foundations/schemas";
import { prefetchSnippet } from "@/features/viewer/actions/prefetch-snippet";

const prefetchedSlugs = new Set<string>();

type PrefetchTriggerProps = {
  slug: Slug;
  children: ReactNode;
};

/**
 * ホバー時にスニペットデータをData Cacheに事前読み込みする
 */
export const PrefetchTrigger = ({ slug, children }: PrefetchTriggerProps) => {
  const mouseEnter = useCallback(() => {
    if (prefetchedSlugs.has(slug)) return;

    prefetchedSlugs.add(slug);

    startTransition(() => {
      prefetchSnippet(slug);
    });
  }, [slug]);

  return <div onMouseEnter={mouseEnter}>{children}</div>;
};
