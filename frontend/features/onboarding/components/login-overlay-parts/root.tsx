import type { ReactNode, RefObject } from "react";
import { NoiseTexture } from "@/foundations/components/noise-texture";

type RootProps = {
  contentRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/**
 * サインインオーバーレイの背景とコンテンツラッパーを提供する
 */
export const Root = ({ contentRef, children }: RootProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
    <NoiseTexture />
    <div ref={contentRef} className="relative z-10">
      {children}
    </div>
  </div>
);
