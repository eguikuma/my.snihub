import { ImageResponse } from "next/og";
import { Slug } from "@/foundations/schemas";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";
import { NotFoundCard, SnippetCard } from "@/features/viewer/opengraph";

export const alt = "SnipShare";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * スニペットのタイトル・言語・コード冒頭を含む OGP 画像を動的に生成する
 */
const OpenGraphImage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const publicSnippet = await fetchSnippet(Slug.from(slug));

  return publicSnippet.match(
    (snippet) => new ImageResponse(<SnippetCard snippet={snippet} />, size),
    () => new ImageResponse(<NotFoundCard />, size),
  );
};

export default OpenGraphImage;
