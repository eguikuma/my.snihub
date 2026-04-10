"use client";

import { startTransition, useCallback, useRef, type ReactNode } from "react";
import type { Slug } from "@/foundations/schemas";
import { prefetchSnippet } from "@/features/viewer/actions/prefetch-snippet";

type PrefetchTriggerProps = {
  slug: Slug;
  children: ReactNode;
};

/**
 * ホバー時にスニペットデータをData Cacheに事前読み込みする
 */
export const PrefetchTrigger = ({ slug, children }: PrefetchTriggerProps) => {
  const prefetched = useRef(false);

  const mouseEnter = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;

    startTransition(() => {
      prefetchSnippet(slug);
    });
  }, [slug]);

  return <div onMouseEnter={mouseEnter}>{children}</div>;
};
