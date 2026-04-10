"use client";

import { startTransition, useEffect, useRef, type ReactNode } from "react";
import type { Slug } from "@/foundations/schemas";
import { prefetchSnippet } from "@/features/viewer/actions/prefetch-snippet";

const prefetchedSlugs = new Set<string>();

type PrefetchTriggerProps = {
  slug: Slug;
  children: ReactNode;
};

/**
 * ビューポートに入った時点でスニペットデータをData Cacheに事前読み込みする
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

        startTransition(() => {
          prefetchSnippet(slug);
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
