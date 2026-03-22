import { SnippetSkeletonCard } from "@/foundations/components/snippet-skeleton-card";

/**
 * ページ遷移中にスケルトンUIを表示する
 */
const Loading = () => (
  <div className="p-4 desktop:p-6">
    <SnippetSkeletonCard />
  </div>
);

export default Loading;
