import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

/**
 * 検索エンジン向けのsitemap.xmlを生成する
 */
const sitemap = (): MetadataRoute.Sitemap => [
  { url: BASE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/snippets`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
];

export default sitemap;
