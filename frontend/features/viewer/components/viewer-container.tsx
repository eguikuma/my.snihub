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
 * キャッシュ済み匿名エンドポイントを優先し、オーナー判定はセッションとローカル比較する
 *
 * 非公開・期限切れスニペットは匿名エンドポイントで404になるため、認証付きフォールバックで取得する
 */
export const ViewerContainer = async ({ params }: ViewerContainerProps) => {
  const { slug: rawSlug } = await params;
  const slug = Slug.from(rawSlug);
  const currentSession = await session.get();

  const snippet = await fetchSnippet(slug);

  if (snippet.isOk()) {
    const isOwner =
      currentSession.ownerHash != null &&
      snippet.value.owner_hash != null &&
      currentSession.ownerHash === snippet.value.owner_hash;

    return <ViewerLayout snippet={snippet.value} isOwner={isOwner} />;
  }

  if (snippet.error.kind === "not_found" && currentSession.token) {
    const fallback = await fetchMySnippet(slug);

    return fallback.match(
      (value) => <ViewerLayout snippet={value} isOwner />,
      (error) =>
        error.kind === "not_found" ? <NotFound /> : throwOutcomeError(error),
    );
  }

  return snippet.error.kind === "not_found" ? (
    <NotFound />
  ) : (
    throwOutcomeError(snippet.error)
  );
};
