import type { SessionOptions as IronSessionOptions } from "iron-session";
import type { Token } from "../schemas/brand";

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
 * セッションの設定（sessions.tsとmiddleware.tsで共有する）
 */
export const SessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "snihub-session",
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
