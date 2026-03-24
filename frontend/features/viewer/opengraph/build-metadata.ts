import type { Metadata } from "next";
import type { Slug } from "@/foundations/schemas";
import { fetchSnippet } from "../actions/fetch-snippet";
import { OGP_CODE_TRUNCATE_LENGTH } from "./definitions";

const NotFoundMetadata: Metadata = {
  title: "スニペットが見つかりません",
};

/**
 * 公開スニペットの情報をもとに OGP メタデータを構築する
 */
export const buildSnippetMetadata = async (slug: Slug): Promise<Metadata> => {
  const publicSnippet = await fetchSnippet(slug);

  return publicSnippet.match(
    (snippet) => {
      const description =
        snippet.description ?? snippet.code.slice(0, OGP_CODE_TRUNCATE_LENGTH);

      return {
        title: snippet.title,
        openGraph: { title: snippet.title, description, type: "article" },
      };
    },
    () => NotFoundMetadata,
  );
};
