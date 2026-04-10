import { cache } from "react";
import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { session } from "@/foundations/libraries/sessions";
import { User } from "@/foundations/schemas";

const MeResponse = z.object({
  data: User,
});

/**
 * 認証済みユーザーを取得し、未認証または失敗時はnullを返す（同一リクエスト内でキャッシュする）
 *
 * セッションCookieにユーザー情報があればAPIコールなしで返す
 * ない場合はAPIで取得して返す
 */
export const fetchMe = cache(async (): Promise<User | null> => {
  try {
    const currentSession = await session.get();

    if (!currentSession.token) {
      return null;
    }

    if (currentSession.user) {
      return currentSession.user;
    }

    const response = await fetcher.get(Endpoints.Me);

    return MeResponse.parse(response).data;
  } catch {
    return null;
  }
});
