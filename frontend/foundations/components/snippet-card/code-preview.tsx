type CodePreviewProps = {
  codePreview: string;
};

/**
 * コードの冒頭数行をプレビュー表示する
 */
export const CodePreview = ({ codePreview }: CodePreviewProps) => (
  <div className="relative mt-3 h-16 overflow-hidden rounded bg-code">
    <pre className="line-clamp-3 text-ellipsis p-2 font-mono text-xs leading-relaxed text-ink-secondary">
      {codePreview}
    </pre>
    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-code to-transparent" />
  </div>
);
