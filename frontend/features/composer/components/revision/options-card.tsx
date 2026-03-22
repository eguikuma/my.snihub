import type { Expiration, Visibility } from "@/foundations/definitions";
import type { SnippetDraftErrors } from "../../definitions";
import type { SnippetRevision } from "../../schemas";
import { ExpirationSelector } from "../expiration-selector";
import { Hint } from "../hint";
import { SnippetOptionsCard } from "../snippet-options-card";
import { VisibilitySelector } from "../visibility-selector";

type OptionsCardProps = {
  fields: SnippetRevision;
  expiresIn: Expiration;
  mergedErrors: SnippetDraftErrors;
  updateField: <K extends keyof SnippetRevision>(
    name: K,
    value: SnippetRevision[K],
  ) => void;
};

/**
 * 公開範囲・有効期限（読み取り専用）・説明・タグの入力カードを描画する
 */
export const OptionsCard = ({
  fields,
  expiresIn,
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
    <SnippetOptionsCard.FieldGroup name="expiration" label="有効期限">
      <ExpirationSelector value={expiresIn} disabled onChange={() => {}} />
      <Hint
        text="有効期限を過ぎたスニペットは、1日以内に自動削除されます"
        isError={false}
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
