/**
 * コードを先頭 n 行に分割して切り詰める
 */
export const toTruncatedLines = (source: string, maxLines: number): string[] =>
  source.split("\n").slice(0, maxLines);

/**
 * 各行を最大文字数で切り詰め、超過分に省略記号を付加する
 */
export const toShortenedLines = (
  lines: string[],
  maxLength: number,
): string[] =>
  lines.map((line) =>
    line.length > maxLength ? `${line.slice(0, maxLength)}...` : line,
  );
