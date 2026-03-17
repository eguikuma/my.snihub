import { ImageResponse } from "next/og";
import { toLanguageLabel } from "@/foundations/definitions";
import { fetchSnippet } from "@/features/viewer/actions";
import { truncateCode } from "./_opengraph/helpers";
import { NotFoundCard } from "./_opengraph/not-found-card";
import { SnippetCard } from "./_opengraph/snippet-card";

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
  const snippet = await fetchSnippet(slug);

  if (!snippet) {
    return new ImageResponse(<NotFoundCard />, size);
  }

  return new ImageResponse(
    <SnippetCard
      title={snippet.title}
      languageLabel={toLanguageLabel(snippet.language)}
      codeLines={truncateCode(snippet.code)}
      userName={snippet.user.name}
    />,
    size,
  );
};

export default OpenGraphImage;
