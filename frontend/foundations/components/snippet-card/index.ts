import { CodePreview } from "./code-preview";
import { Footer } from "./footer";
import { Root } from "./root";
import { Tags } from "./tags";
import { Title } from "./title";

/**
 * スニペットカードの Compound Component
 */
export const SnippetCard = {
  Root,
  Title,
  Tags,
  CodePreview,
  Footer,
} as const;
