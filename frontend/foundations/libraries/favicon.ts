/**
 * テーマのアクセントカラーからfavicon用のSVG data URLを生成する
 */
export const favicon = {
  toDataUrl: (accentColor: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="6" fill="${accentColor}"/><text x="16" y="22" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff">&lt;/&gt;</text></svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  },
};
