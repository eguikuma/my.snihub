import type { Visibility } from "@/foundations/definitions";
import type { SnippetDraftErrors } from "../../definitions";
import type { SnippetRevision } from "../../schemas";
import { SnippetOptionsCard } from "../snippet-options-card";
import { VisibilitySelector } from "../visibility-selector";

type OptionsCardProps = {
  fields: SnippetRevision;
  mergedErrors: SnippetDraftErrors;
  updateField: <K extends keyof SnippetRevision>(
    name: K,
    value: SnippetRevision[K],
  ) => void;
};

/**
 * 公開範囲・説明・タグの入力カードを描画する（有効期限なし）
 */
export const OptionsCard = ({
  fields,
  mergedErrors,
  updateField,
}: OptionsCardProps) => (
  <SnippetOptionsCard.Root>
    <SnippetOptionsCard.FieldGroup name="visibility" label="公開範囲">
      <VisibilitySelector
        value={fields.visibility}
        onChange={(value: Visibility) => updateField("visibility", value)}
      />
    </SnippetOptionsCard.FieldGroup>
    <SnippetOptionsCard.DescriptionField
      value={fields.description}
      errorMessage={mergedErrors.description}
      onChange={(value) => updateField("description", value)}
    />
    <SnippetOptionsCard.TagsField
      tags={fields.tags}
      errorMessage={mergedErrors.tags}
      onChange={(tags) => updateField("tags", tags)}
    />
  </SnippetOptionsCard.Root>
);
