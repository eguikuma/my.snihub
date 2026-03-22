import { MAX_PREVIEW_LINES } from "../../definitions";
import { toTruncatedLines } from "../../libraries/code";

type CodePreviewProps = {
  code: string;
};

/**
 * コードの冒頭数行をプレビュー表示する
 */
export const CodePreview = ({ code }: CodePreviewProps) => (
  <div className="relative mt-3 h-16 overflow-hidden rounded bg-code">
    <pre className="line-clamp-3 text-ellipsis p-2 font-mono text-xs leading-relaxed text-ink-secondary">
      {toTruncatedLines(code, MAX_PREVIEW_LINES).join("\n")}
    </pre>
    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-code to-transparent" />
  </div>
);
