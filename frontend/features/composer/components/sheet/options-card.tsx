import clsx from "clsx";
import type { Expiration, Visibility } from "@/foundations/definitions";
import {
  SnippetDraftHints,
  type SnippetDraftErrors,
} from "@/features/composer/definitions";
import type { SnippetDraft } from "@/features/composer/schemas";
import { ExpirationSelector } from "../expiration-selector";
import { Hint } from "../hint";
import { TagPicker } from "../tag-picker";
import { VisibilitySelector } from "../visibility-selector";

type OptionsCardProps = {
  fields: SnippetDraft;
  mergedErrors: SnippetDraftErrors;
  updateField: <K extends keyof SnippetDraft>(
    name: K,
    value: SnippetDraft[K],
  ) => void;
};

/**
 * 公開範囲・有効期限・説明・タグの入力カードを描画する
 */
export const OptionsCard = ({
  fields,
  mergedErrors,
  updateField,
}: OptionsCardProps) => (
  <div className="flex flex-col gap-5 rounded-lg border border-edge bg-surface-raised p-4">
    <div data-field="visibility" className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">公開範囲</span>
      <VisibilitySelector
        value={fields.visibility}
        onChange={(value: Visibility) => updateField("visibility", value)}
      />
    </div>

    <div data-field="expiration" className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">有効期限</span>
      <ExpirationSelector
        value={fields.expiration}
        onChange={(value: Expiration) => updateField("expiration", value)}
      />
    </div>

    <div data-field="description" className="flex flex-col gap-1.5">
      <label htmlFor="description" className="text-sm font-medium text-ink">
        説明
      </label>
      <textarea
        id="description"
        value={fields.description}
        onChange={(event) => updateField("description", event.target.value)}
        rows={3}
        className={clsx(
          "resize-y rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:ring-3",
          mergedErrors.description
            ? "border-danger focus:ring-danger/8"
            : "border-edge focus:border-accent focus:ring-accent/10",
        )}
      />
      <Hint
        text={mergedErrors.description ?? SnippetDraftHints.Description}
        isError={!!mergedErrors.description}
      />
    </div>

    <div data-field="tags" className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">タグ</span>
      <TagPicker
        tags={fields.tags}
        onChange={(tags: string[]) => updateField("tags", tags)}
        hasError={!!mergedErrors.tags}
      />
      <Hint
        text={mergedErrors.tags ?? SnippetDraftHints.Tags}
        isError={!!mergedErrors.tags}
      />
    </div>
  </div>
);
