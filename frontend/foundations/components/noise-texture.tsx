/**
 * ノイズテクスチャ
 */
export const NoiseTexture = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
    aria-hidden="true"
  >
    <filter id="noise-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.7"
        numOctaves="4"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise-filter)" />
  </svg>
);
