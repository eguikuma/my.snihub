import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import type { Token } from "../schemas/brand";

/**
 * セッションを管理するCookieの名前
 */
const SESSION_COOKIE_NAME = "snipshare-session";

export type Session = {
  /**
   * 認証トークン
   */
  token?: Token;
  /**
   * CSRF対策のstate
   */
  state?: string;
  /**
   * 認可後のリダイレクト先
   */
  redirectTo?: string;
};

/**
 * セッションの設定
 */
const SessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    /**
     * 30日間の有効期限
     */
    maxAge: 60 * 60 * 24 * 30,
  },
};

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
