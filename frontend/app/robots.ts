import type { MetadataRoute } from "next";

/**
 * クローラー向けのrobots.txtを生成する
 */
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/snippets/mine", "/snippets/new", "/api/"],
  },
});

export default robots;
