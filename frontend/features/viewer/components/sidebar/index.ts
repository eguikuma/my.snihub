import { ActionsMenu } from "./actions-menu";
import { Author } from "./author";
import { Root } from "./root";
import { Section } from "./section";
import { Timestamps } from "./timestamps";

/**
 * スニペットサイドバーの Compound Component
 */
export const SnippetSidebar = {
  Root,
  Author,
  Section,
  Timestamps,
  ActionsMenu,
} as const;
