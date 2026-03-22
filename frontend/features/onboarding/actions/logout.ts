"use server";

import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { session } from "@/foundations/libraries/sessions";

/**
 * バックエンドのトークンを無効化し、ローカルセッションを破棄する
 *
 * バックエンドの呼び出しが失敗しても必ずローカルセッションは破棄する
 */
export const logout = async (): Promise<void> => {
  try {
    await fetcher.delete(Endpoints.CurrentSession);
  } finally {
    await session.destroy();
  }
};
