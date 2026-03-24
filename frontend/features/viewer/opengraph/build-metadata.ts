import type { Metadata } from "next";
import { session } from "@/foundations/libraries/sessions";
import type { Slug } from "@/foundations/schemas";
import { fetchMySnippet } from "../actions/fetch-my-snippet";
import { fetchSnippet } from "../actions/fetch-snippet";
import { OGP_CODE_TRUNCATE_LENGTH } from "./definitions";

const NotFoundMetadata: Metadata = {
  title: "スニペットが見つかりません",
};

/**
 * スニペットのタイトルとコードからOGP用のdescriptionを組み立てる
 */
const toMetadata = (snippet: {
  title: string;
  description: string | null;
  code: string;
}): Metadata => {
  const description =
    snippet.description ?? snippet.code.slice(0, OGP_CODE_TRUNCATE_LENGTH);

  return {
    title: snippet.title,
    openGraph: { title: snippet.title, description, type: "article" },
  };
};

/**
 * スニペットの情報をもとに OGP メタデータを構築する
 */
export const buildSnippetMetadata = async (slug: Slug): Promise<Metadata> => {
  const currentSession = await session.get();

  if (currentSession.token) {
    const [mySnippet, publicSnippet] = await Promise.all([
      fetchMySnippet(slug),
      fetchSnippet(slug),
    ]);

    if (mySnippet.isOk()) {
      return toMetadata(mySnippet.value);
    }

    return publicSnippet.match(
      (snippet) => toMetadata(snippet),
      () => NotFoundMetadata,
    );
  }

  const publicSnippet = await fetchSnippet(slug);

  return publicSnippet.match(
    (snippet) => toMetadata(snippet),
    () => NotFoundMetadata,
  );
};
