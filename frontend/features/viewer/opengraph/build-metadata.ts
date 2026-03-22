import type { Metadata } from "next";
import { session } from "@/foundations/libraries/sessions";
import type { Slug } from "@/foundations/schemas";
import { fetchMySnippet } from "../actions/fetch-my-snippet";
import { fetchSnippet } from "../actions/fetch-snippet";
import { OGP_CODE_TRUNCATE_LENGTH } from "./definitions";

const NOT_FOUND_METADATA: Metadata = {
  title: "スニペットが見つかりません | SnipShare",
};

/**
 * スニペットの情報をもとに OGP メタデータを構築する
 */
export const buildSnippetMetadata = async (slug: Slug): Promise<Metadata> => {
  const currentSession = await session.get();

  if (currentSession.token) {
    const mySnippet = await fetchMySnippet(slug);

    if (mySnippet.isOk()) {
      const snippet = mySnippet.value;
      const description =
        snippet.description ?? snippet.code.slice(0, OGP_CODE_TRUNCATE_LENGTH);

      return {
        title: `${snippet.title} | SnipShare`,
        openGraph: { title: snippet.title, description, type: "article" },
      };
    }
  }

  const publicSnippet = await fetchSnippet(slug);

  if (publicSnippet.isErr()) {
    return NOT_FOUND_METADATA;
  }

  const snippet = publicSnippet.value;
  const description =
    snippet.description ?? snippet.code.slice(0, OGP_CODE_TRUNCATE_LENGTH);

  return {
    title: `${snippet.title} | SnipShare`,
    openGraph: { title: snippet.title, description, type: "article" },
  };
};
