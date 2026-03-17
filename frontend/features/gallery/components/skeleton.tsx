import clsx from "clsx";

const SKELETON_COUNT = 8;

/**
 * シマー付きのプレースホルダー矩形を描画する
 */
const Bone = ({ className }: { className?: string }) => (
  <div
    className={clsx("rounded bg-surface-hover", className)}
    style={{
      backgroundImage:
        "linear-gradient(90deg, transparent 0%, var(--color-edge) 50%, transparent 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite linear",
    }}
  />
);

/**
 * スニペットカード1枚分のローディングスケルトンを描画する
 */
const SkeletonCard = () => (
  <div className="flex flex-col gap-3 rounded-lg border border-edge bg-surface-raised p-5">
    {/* タイトル + バッジ */}
    <div className="flex flex-col gap-2">
      <Bone className="h-4 w-3/4" />
      <div className="flex gap-2">
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

    {/* フッター */}
    <div className="flex items-center gap-2 pt-1">
      <Bone className="h-6 w-6 rounded-full" />
      <Bone className="h-3 w-20" />
      <Bone className="ml-auto h-3 w-14" />
    </div>
  </div>
);

/**
 * カード一覧のローディング中にスケルトングリッドを表示する
 */
export const Skeleton = () => (
  <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3 wide:grid-cols-4">
    {Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);
