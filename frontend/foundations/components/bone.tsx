import clsx from "clsx";

/**
 * シマー付きのプレースホルダー矩形を描画する
 *
 * スケルトンローディングの基本パーツとして、各featureのSkeletonCardから使用する
 */
export const Bone = ({ className }: { className?: string }) => (
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
