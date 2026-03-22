import { Group } from "./group";
import { Panel } from "./panel";
import { Root } from "./root";
import { Separator } from "./separator";
import { Trigger } from "./trigger";

/**
 * テーマ切替ドロップダウンの Compound Component
 */
export const ThemeDropdown = {
  Root,
  Trigger,
  Panel,
  Separator,
  Group,
} as const;
