"use client";

import { createContext, useContext } from "react";

type PaginationContextValue = {
  isPending: boolean;
  onPageChange: (page: number) => void;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

/**
 * ページネーションの状態とコールバックを子コンポーネントに提供する
 */
export const PaginationProvider = PaginationContext.Provider;

/**
 * ページネーションの状態とコールバックを取得する
 */
export const usePaginationContext = () => {
  const context = useContext(PaginationContext);

  if (!context) {
    throw new Error(
      "usePaginationContext must be used within PaginationProvider",
    );
  }

  return context;
};
