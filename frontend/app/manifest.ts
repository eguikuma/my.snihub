import type { MetadataRoute } from "next";
import { DEFAULT_THEME_ID, ThemeAccentColors } from "@/foundations/definitions";

/**
 * PWA用のWeb App Manifestを生成する
 */
const manifest = (): MetadataRoute.Manifest => ({
  name: "SniHub",
  short_name: "SniHub",
  description: "コードスニペット共有サービス",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: ThemeAccentColors[DEFAULT_THEME_ID],
  icons: [
    {
      src: "/icon.svg",
      sizes: "any",
      type: "image/svg+xml",
    },
    {
      src: "/apple-icon.svg",
      sizes: "180x180",
      type: "image/svg+xml",
    },
  ],
});

export default manifest;
