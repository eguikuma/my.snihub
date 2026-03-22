"use client";

import { useLoginOverlay } from "../hooks";
import { LoginOverlayParts } from "./login-overlay-parts";

/**
 * ログインオーバーレイを表示する
 */
export const LoginOverlay = () => {
  const { isOpen, contentRef } = useLoginOverlay();

  if (!isOpen) return null;

  return (
    <LoginOverlayParts.Root contentRef={contentRef}>
      <LoginOverlayParts.Card>
        <LoginOverlayParts.Logo />
        <LoginOverlayParts.FeatureList />
        <LoginOverlayParts.ProviderButton />
        <LoginOverlayParts.Disclaimer />
      </LoginOverlayParts.Card>
    </LoginOverlayParts.Root>
  );
};
