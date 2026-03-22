import { CardGrid } from "./card-grid";
import { EmptyState } from "./empty-state";
import { FilterPanel } from "./filter-panel";
import { ResultArea } from "./result-area";
import { Root } from "./root";

/**
 * マイスニペット画面の Compound Component
 */
export const CollectionShell = {
  Root,
  FilterPanel,
  CardGrid,
  ResultArea,
  EmptyState,
} as const;
