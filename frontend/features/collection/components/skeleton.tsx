import { Bone } from "@/foundations/components/bone";

const SKELETON_COUNT = 8;

/**
 * マイスニペットカード1枚分のローディングスケルトンを描画する
 */
const SkeletonCard = () => (
  <div className="flex flex-col gap-3 rounded-lg border border-edge bg-surface-raised p-5">
    {/* タイトル + バッジ */}
    <div className="flex flex-col gap-2">
      <Bone className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Bone className="h-5 w-14" />
        <Bone className="h-5 w-16" />
        <Bone className="h-5 w-12" />
      </div>
    </div>

    {/* コードプレビュー */}
    <div className="flex flex-col gap-1.5">
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-5/6" />
      <Bone className="h-3 w-2/3" />
    </div>

    {/* アクション行 */}
    <div className="flex items-center justify-between pt-1">
      <Bone className="h-3 w-14" />
      <div className="flex gap-3">
        <Bone className="h-3 w-8" />
        <Bone className="h-3 w-8" />
      </div>
    </div>
  </div>
);

/**
 * マイスニペット一覧のローディング中にスケルトングリッドを表示する
 */
export const Skeleton = () => (
  <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3 wide:grid-cols-4">
    {Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);
