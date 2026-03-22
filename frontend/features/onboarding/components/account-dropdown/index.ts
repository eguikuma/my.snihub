import { ActionItem } from "./action-item";
import { LinkItem } from "./link-item";
import { Panel } from "./panel";
import { Root } from "./root";
import { Separator } from "./separator";
import { Trigger } from "./trigger";
import { UserSummary } from "./user-summary";

/**
 * アカウントドロップダウンの Compound Component
 */
export const AccountDropdown = {
  Root,
  Trigger,
  Panel,
  UserSummary,
  Separator,
  LinkItem,
  ActionItem,
} as const;
