import type { MetadataRoute } from "next";
import { DEFAULT_THEME_ID, ThemeAccentColors } from "@/foundations/definitions";

/**
 * PWA用のWeb App Manifestを生成する
 */
const manifest = (): MetadataRoute.Manifest => ({
  name: "SniHub",
  short_name: "SniHub",
  description: "コードスニペットを保存・共有できるシンプルなサービス",
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
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
});

export default manifest;
