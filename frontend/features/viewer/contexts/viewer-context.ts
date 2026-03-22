"use client";

import { createContext, use } from "react";

type ViewerState = {
  readonly startEditing: () => void;
  readonly startDeleting: () => void;
};

const ViewerContext = createContext<ViewerState | null>(null);

/**
 * ViewerContext の値を取得する（プロバイダー外では null を返す）
 */
export const useViewerContext = (): ViewerState | null => use(ViewerContext);

export const ViewerProvider = ViewerContext.Provider;
