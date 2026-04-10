"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BffEndpoints } from "@/foundations/definitions";
import type { Slug } from "@/foundations/schemas";

const prefetchedSlugs = new Set<string>();

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

        prefetchedSlugs.add(slug);
        observer.disconnect();

        fetch(`${BffEndpoints.PrefetchSnippet}?slug=${slug}`);
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
