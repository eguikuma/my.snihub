import { DescriptionField } from "./description-field";
import { FieldGroup } from "./field-group";
import { Root } from "./root";
import { TagsField } from "./tags-field";

/**
 * スニペットオプションカードの Compound Component
 */
export const SnippetOptionsCard = {
  Root,
  FieldGroup,
  DescriptionField,
  TagsField,
} as const;
