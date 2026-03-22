"use client";

import { FolderOpen, Plus } from "lucide-react";
import { Routes } from "@/foundations/definitions";
import type { User } from "@/foundations/schemas";
import { useAccountDropdown } from "../hooks";
import { AccountDropdown } from "./account-dropdown";

type AccountProps = {
  user: User;
};

/**
 * アカウントのドロップダウンメニューを表示する
 */
export const Account = ({ user }: AccountProps) => {
  const { opened, close, toggle, menuRef, handleLogout, isLoggingOut } =
    useAccountDropdown();

  return (
    <AccountDropdown.Root menuRef={menuRef}>
      <AccountDropdown.Trigger
        name={user.name}
        avatarUrl={user.avatar_url}
        onToggle={toggle}
      />
      {opened && (
        <AccountDropdown.Panel>
          <AccountDropdown.UserSummary name={user.name} email={user.email} />
          <AccountDropdown.Separator />
          <AccountDropdown.LinkItem
            href={Routes.SnippetNew}
            icon={<Plus size={14} />}
            onClick={close}
          >
            新規作成
          </AccountDropdown.LinkItem>
          <AccountDropdown.LinkItem
            href={Routes.SnippetMine}
            icon={<FolderOpen size={14} />}
            onClick={close}
          >
            マイスニペット
          </AccountDropdown.LinkItem>
          <AccountDropdown.Separator />
          <AccountDropdown.ActionItem
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            ログアウト
          </AccountDropdown.ActionItem>
        </AccountDropdown.Panel>
      )}
    </AccountDropdown.Root>
  );
};
