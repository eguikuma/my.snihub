"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type UseSearchParametersOptions = {
  /**
   * ページ番号などの更新時に自動リセットするキー
   */
  resetKeys?: string[];
};

/**
 * URLのクエリパラメータを取得・更新し、指定キーの自動リセットをサポートする
 */
export const useSearchParameters = (
  options: UseSearchParametersOptions = {},
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { resetKeys = [] } = options;

  const get = (key: string) => searchParams.get(key) ?? "";

  const update = (key: string, value: string) => {
    const nextParameters = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParameters.set(key, value);
    } else {
      nextParameters.delete(key);
    }

    for (const resetKey of resetKeys) {
      nextParameters.delete(resetKey);
    }

    const queryString = nextParameters.toString();
    startTransition(() => {
      router.replace(
        (queryString ? `${pathname}?${queryString}` : pathname) as Route,
      );
    });
  };

  return { get, update, isPending } as const;
};
