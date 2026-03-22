import { CardGrid } from "./card-grid";
import { FilterPanel } from "./filter-panel";
import { ResultArea } from "./result-area";
import { Root } from "./root";

/**
 * ギャラリー画面の Compound Component
 */
export const GalleryShell = {
  Root,
  FilterPanel,
  CardGrid,
  ResultArea,
} as const;
