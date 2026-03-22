import { SnippetDraftHints } from "../../definitions";
import { Hint } from "../hint";
import { TagPicker } from "../tag-picker";

type TagsFieldProps = {
  tags: string[];
  errorMessage?: string;
  onChange: (tags: string[]) => void;
};

/**
 * タグ入力フィールドをラベル・ヒント付きで描画する
 */
export const TagsField = ({ tags, errorMessage, onChange }: TagsFieldProps) => (
  <div data-field="tags" className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-ink">タグ</span>
    <TagPicker tags={tags} onChange={onChange} hasError={!!errorMessage} />
    <Hint
      text={errorMessage ?? SnippetDraftHints.Tags}
      isError={!!errorMessage}
    />
  </div>
);
