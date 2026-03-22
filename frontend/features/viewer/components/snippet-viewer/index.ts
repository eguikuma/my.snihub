import { CodeBlock } from "./code-block";
import { ContentGrid } from "./content-grid";
import { MainColumn } from "./main-column";
import { MetaBar } from "./meta-bar";
import { Root } from "./root";
import { TagList } from "./tag-list";

/**
 * スニペット閲覧画面の Compound Component
 */
export const SnippetViewer = {
  Root,
  ContentGrid,
  MainColumn,
  CodeBlock,
  MetaBar,
  TagList,
} as const;
