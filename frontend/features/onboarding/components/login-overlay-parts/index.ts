import { Card } from "./card";
import { Disclaimer } from "./disclaimer";
import { FeatureList } from "./feature-list";
import { Logo } from "./logo";
import { ProviderButton } from "./provider-button";
import { Root } from "./root";

/**
 * ログインオーバーレイの Compound Component
 */
export const LoginOverlayParts = {
  Root,
  Card,
  Logo,
  FeatureList,
  ProviderButton,
  Disclaimer,
} as const;
