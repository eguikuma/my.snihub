import clsx from "clsx";
import { SnippetDraftHints } from "../../definitions";
import { Hint } from "../hint";

type TitleFieldProps = {
  value: string;
  errorMessage?: string;
  onChange: (value: string) => void;
};

/**
 * タイトル入力フィールドをラベル・ヒント付きで描画する
 */
export const TitleField = ({
  value,
  errorMessage,
  onChange,
}: TitleFieldProps) => (
  <div data-field="title" className="flex flex-col gap-1.5">
    <label htmlFor="title" className="text-sm font-medium text-ink">
      タイトル
    </label>
    <input
      id="title"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={clsx(
        "rounded-lg border bg-surface-raised px-3 py-2 text-base tablet:text-sm text-ink outline-none transition-colors focus:ring-3",
        errorMessage
          ? "border-danger focus:ring-danger/8"
          : "border-edge focus:border-accent focus:ring-accent/10",
      )}
    />
    <Hint
      text={errorMessage ?? SnippetDraftHints.Title}
      isError={!!errorMessage}
    />
  </div>
);
