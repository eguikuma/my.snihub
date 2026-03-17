import { Skeleton } from "@/features/gallery/components/skeleton";

/**
 * ページ遷移中にスケルトンUIを表示する
 */
const Loading = () => (
  <div className="p-4 desktop:p-6">
    <Skeleton />
  </div>
);

export default Loading;
