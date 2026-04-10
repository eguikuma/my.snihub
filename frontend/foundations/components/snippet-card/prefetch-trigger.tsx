"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BffEndpoints } from "@/foundations/definitions";
import type { Slug } from "@/foundations/schemas";

const prefetchedSlugs = new Set<string>();

/**
 * スクロール時に大量のプリフェッチが同時発火してバックエンドに負荷をかけないよう制限する
 */
const MAX_CONCURRENT_PREFETCHES = 3;
let activePrefetches = 0;

type PrefetchTriggerProps = {
  slug: Slug;
  children: ReactNode;
};

/**
 * ビューポートに入った時点でスニペットデータをData Cacheに事前読み込みする
 *
 * Server ActionではなくRoute Handlerを使うことでRSCツリーの再レンダリングを回避する
 */
export const PrefetchTrigger = ({ slug, children }: PrefetchTriggerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefetchedSlugs.has(slug)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (activePrefetches >= MAX_CONCURRENT_PREFETCHES) return;

        prefetchedSlugs.add(slug);
        observer.disconnect();

        activePrefetches++;
        fetch(`${BffEndpoints.PrefetchSnippet}?slug=${slug}`).finally(() => {
          activePrefetches--;
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [slug]);

  return (
    <div ref={ref} className="grid">
      {children}
    </div>
  );
};
