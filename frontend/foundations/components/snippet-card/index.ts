import { CodePreview } from "./code-preview";
import { Footer } from "./footer";
import { PrefetchTrigger } from "./prefetch-trigger";
import { Root } from "./root";
import { Tags } from "./tags";
import { Title } from "./title";

/**
 * スニペットカードの Compound Component
 */
export const SnippetCard = {
  Root,
  PrefetchTrigger,
  Title,
  Tags,
  CodePreview,
  Footer,
} as const;
