import clsx from "clsx";

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
 * スニペット詳細画面のローディング中にスケルトンを表示する
 */
export const Skeleton = () => (
  <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
    {/* パンくず */}
    <Bone className="h-4 w-48" />

    <div className="grid grid-cols-1 gap-5 tablet:grid-cols-[1fr_176px] desktop:grid-cols-[1fr_240px] desktop:gap-6">
      {/* メインエリア */}
      <div className="flex flex-col gap-4">
        {/* ツールバー + コードビューア */}
        <div className="overflow-hidden rounded-lg border border-edge">
          <div className="flex items-center justify-between border-b border-edge bg-surface-hover px-4 py-2">
            <Bone className="h-5 w-20" />
            <div className="flex items-center gap-2">
              <Bone className="h-6 w-12" />
              <Bone className="h-6 w-16" />
            </div>
          </div>
          <div className="flex flex-col gap-2 p-6">
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-5/6" />
            <Bone className="h-3 w-4/6" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-3/4" />
            <Bone className="h-3 w-5/6" />
            <Bone className="h-3 w-2/3" />
            <Bone className="h-3 w-full" />
          </div>
        </div>

        {/* メタバー */}
        <div className="flex flex-col gap-3">
          <Bone className="h-6 w-2/3" />
          <Bone className="h-4 w-full" />
        </div>
      </div>

      {/* サイドバー */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-12" />
          <div className="flex items-center gap-2">
            <Bone className="h-7 w-7 rounded-full" />
            <Bone className="h-4 w-20" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-8" />
          <Bone className="h-5 w-20" />
        </div>
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-8" />
          <div className="flex flex-wrap gap-1.5">
            <Bone className="h-6 w-16 rounded-full" />
            <Bone className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Bone className="h-4 w-32" />
          <Bone className="h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
);
