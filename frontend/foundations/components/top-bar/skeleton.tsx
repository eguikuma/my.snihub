/**
 * TopBarの読み込み中に表示するスケルトンを描画する
 */
export const TopBarSkeleton = () => (
  <header className="sticky top-0 z-50 flex h-top-bar items-center justify-between border-b border-edge bg-surface-raised px-4">
    <div className="h-4 w-20 animate-pulse rounded bg-surface-sunken" />

    <div className="flex items-center gap-2">
      <div className="h-8 w-8 animate-pulse rounded bg-surface-sunken" />
      <div className="h-8 w-16 animate-pulse rounded bg-surface-sunken" />
    </div>
  </header>
);
