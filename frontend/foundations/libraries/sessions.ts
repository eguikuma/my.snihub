import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionOptions, type Session } from "./session-options";

export type { Session };

/**
 * 暗号化されたセッションをCookieから取得する
 */
const getSession = async () => {
  return getIronSession<Session>(await cookies(), SessionOptions);
};

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
