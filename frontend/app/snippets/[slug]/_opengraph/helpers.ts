import { MAX_CODE_LINES, MAX_LINE_LENGTH } from "./definitions";

/**
 * コードを先頭数行に切り詰め、長い行は省略する
 */
export const truncateCode = (code: string): string[] => {
  return code
    .split("\n")
    .slice(0, MAX_CODE_LINES)
    .map((line) =>
      line.length > MAX_LINE_LENGTH
        ? `${line.slice(0, MAX_LINE_LENGTH)}...`
        : line,
    );
};
