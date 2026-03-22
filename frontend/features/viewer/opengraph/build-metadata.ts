import type { Metadata } from "next";
import { Referrers } from "@/foundations/definitions";
import { fetchMySnippet, fetchSnippet } from "../actions";
import { OGP_CODE_TRUNCATE_LENGTH } from "./definitions";

/**
 * スニペットの情報をもとに OGP メタデータを構築する
 */
export const buildSnippetMetadata = async (
  slug: string,
  from: string,
): Promise<Metadata> => {
  const snippet = await (from === Referrers.MINE
    ? fetchMySnippet(slug)
    : fetchSnippet(slug));

  if (!snippet) {
    return { title: "スニペットが見つかりません | SnipShare" };
  }

  const description =
    snippet.description ?? snippet.code.slice(0, OGP_CODE_TRUNCATE_LENGTH);

  return {
    title: `${snippet.title} | SnipShare`,
    openGraph: {
      title: snippet.title,
      description,
      type: "article",
    },
  };
};
