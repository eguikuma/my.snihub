import { ActionBar } from "./action-bar";
import { Message } from "./message";
import { Root } from "./root";
import { WarningIcon } from "./warning-icon";

/**
 * 削除確認オーバーレイの Compound Component
 */
export const RemovalPrompt = {
  Root,
  WarningIcon,
  Message,
  ActionBar,
} as const;
