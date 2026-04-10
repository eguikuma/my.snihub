"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BffEndpoints } from "@/foundations/definitions";
import type { Slug } from "@/foundations/schemas";

const prefetchedSlugs = new Set<string>();

/**
 * スクロール時に大量のプリフェッチが同時発火してバックエンドに負荷をかけないよう、キューで順次実行する
 */
const MAX_CONCURRENT_PREFETCHES = 6;
let activePrefetches = 0;
const pendingQueue: string[] = [];

const executePrefetch = (slug: string) => {
  activePrefetches++;
  fetch(`${BffEndpoints.PrefetchSnippet}?slug=${slug}`).finally(() => {
    activePrefetches--;
    drainQueue();
  });
};

const drainQueue = () => {
  while (
    pendingQueue.length > 0 &&
    activePrefetches < MAX_CONCURRENT_PREFETCHES
  ) {
    const next = pendingQueue.shift()!;
    executePrefetch(next);
  }
};

const enqueue = (slug: string) => {
  if (prefetchedSlugs.has(slug)) return;
  prefetchedSlugs.add(slug);

  if (activePrefetches < MAX_CONCURRENT_PREFETCHES) {
    executePrefetch(slug);
  } else {
    pendingQueue.push(slug);
  }
};

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

        observer.disconnect();
        enqueue(slug);
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
