import { cookies } from "next/headers";
import { cache } from "react";
import { getIronSession } from "iron-session";
import { SessionOptions, type Session } from "./session-options";

export type { Session };

/**
 * 暗号化されたセッションをCookieから取得する（同一リクエスト内でキャッシュする）
 */
const getSession = cache(async () => {
  return getIronSession<Session>(await cookies(), SessionOptions);
});

/**
 * 現在のセッションを破棄する
 */
const destroySession = async () => {
  const currentSession = await getSession();
  currentSession.destroy();
};

export const session = {
  get: getSession,
  destroy: destroySession,
};
