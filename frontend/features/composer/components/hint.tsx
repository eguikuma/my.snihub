import clsx from "clsx";

type HintProps = {
  text: string;
  isError: boolean;
};

/**
 * フォームフィールド下部にヒントテキストまたはエラーメッセージを表示する
 */
export const Hint = ({ text, isError }: HintProps) => {
  return (
    <p
      className={clsx(
        "text-xs leading-relaxed",
        isError ? "text-danger" : "text-ink-muted",
      )}
    >
      {text}
    </p>
  );
};
