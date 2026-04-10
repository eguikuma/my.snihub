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
 * 認証状態に応じてスニペット詳細を取得し表示する
 *
 * 認証ユーザーは自分のスニペットを取得する（非公開スニペットも含む）
 * 未認証ユーザーはキャッシュ済みの匿名エンドポイントを使う
 */
export const ViewerContainer = async ({ params }: ViewerContainerProps) => {
  const { slug: rawSlug } = await params;
  const slug = Slug.from(rawSlug);
  const currentSession = await session.get();

  const snippet = currentSession.token
    ? await fetchMySnippet(slug)
    : await fetchSnippet(slug);

  return snippet.match(
    (value) => <ViewerLayout snippet={value} />,
    (error) =>
      error.kind === "not_found" ? <NotFound /> : throwOutcomeError(error),
  );
};
