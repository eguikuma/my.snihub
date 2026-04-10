import { throwOutcomeError } from "@/foundations/libraries/outcome";
import { session } from "@/foundations/libraries/sessions";
import { Slug } from "@/foundations/schemas";
import { fetchMySnippet } from "../actions/fetch-my-snippet";
import { fetchSnippet } from "../actions/fetch-snippet";
import { NotFound } from "./not-found";
import { ViewerLayout } from "./viewer-layout";

type ViewerContainerProps = {
  params: PageProps<"/snippets/[slug]">["params"];
};

/**
 * 認証ユーザーはユーザー別キャッシュ、未認証は共有キャッシュでスニペットを取得する
 *
 * 認証ユーザーのオーナー判定はセッションの ownerHash とレスポンスの owner_hash をローカル比較する
 */
export const ViewerContainer = async ({ params }: ViewerContainerProps) => {
  const { slug: rawSlug } = await params;
  const slug = Slug.from(rawSlug);
  const currentSession = await session.get();

  const snippet = currentSession.ownerHash
    ? await fetchMySnippet(slug, currentSession.ownerHash)
    : await fetchSnippet(slug);

  return snippet.match(
    (value) => {
      const isOwner =
        currentSession.ownerHash != null &&
        value.owner_hash != null &&
        currentSession.ownerHash === value.owner_hash;

      return <ViewerLayout snippet={value} isOwner={isOwner} />;
    },
    (error) =>
      error.kind === "not_found" ? <NotFound /> : throwOutcomeError(error),
  );
};
