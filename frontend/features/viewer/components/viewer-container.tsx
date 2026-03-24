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
 * オーナー判定を行ったうえで、スニペット詳細を表示する
 */
export const ViewerContainer = async ({ params }: ViewerContainerProps) => {
  const { slug: rawSlug } = await params;
  const slug = Slug.from(rawSlug);
  const currentSession = await session.get();

  if (currentSession.token) {
    const [mySnippet, publicSnippet] = await Promise.all([
      fetchMySnippet(slug),
      fetchSnippet(slug),
    ]);

    if (mySnippet.isOk()) {
      return <ViewerLayout snippet={mySnippet.value} />;
    }

    return publicSnippet.match(
      (snippet) => <ViewerLayout snippet={snippet} />,
      () => <NotFound />,
    );
  }

  const publicSnippet = await fetchSnippet(slug);

  return publicSnippet.match(
    (snippet) => <ViewerLayout snippet={snippet} />,
    () => <NotFound />,
  );
};
