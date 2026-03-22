import clsx from "clsx";
import { SnippetDraftHints } from "../../definitions";
import { Hint } from "../hint";

type DescriptionFieldProps = {
  value: string;
  errorMessage?: string;
  onChange: (value: string) => void;
};

/**
 * 説明文のテキストエリアをラベル・ヒント付きで描画する
 */
export const DescriptionField = ({
  value,
  errorMessage,
  onChange,
}: DescriptionFieldProps) => (
  <div data-field="description" className="flex flex-col gap-1.5">
    <label htmlFor="description" className="text-sm font-medium text-ink">
      説明
    </label>
    <textarea
      id="description"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={3}
      className={clsx(
        "resize-y rounded-lg border bg-surface-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:ring-3",
        errorMessage
          ? "border-danger focus:ring-danger/8"
          : "border-edge focus:border-accent focus:ring-accent/10",
      )}
    />
    <Hint
      text={errorMessage ?? SnippetDraftHints.Description}
      isError={!!errorMessage}
    />
  </div>
);
