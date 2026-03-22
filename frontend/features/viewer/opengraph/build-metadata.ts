import type { Metadata } from "next";
import { session } from "@/foundations/libraries/sessions";
import { fetchMySnippet } from "../actions/fetch-my-snippet";
import { fetchSnippet } from "../actions/fetch-snippet";
import { OGP_CODE_TRUNCATE_LENGTH } from "./definitions";

/**
 * スニペットの情報をもとに OGP メタデータを構築する
 */
export const buildSnippetMetadata = async (slug: string): Promise<Metadata> => {
  const currentSession = await session.get();
  let snippet = null;

  if (currentSession.token) {
    snippet = await fetchMySnippet(slug);
  }

  if (!snippet) {
    snippet = await fetchSnippet(slug);
  }

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
