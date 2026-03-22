"use server";

import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { User } from "@/foundations/schemas";

const MeResponse = z.object({
  data: User,
});

/**
 * 認証済みユーザーを取得し、未認証または失敗時はnullを返す
 */
export const fetchMe = async (): Promise<User | null> => {
  try {
    const response = await fetcher.get(Endpoints.Me);

    return MeResponse.parse(response).data;
  } catch {
    return null;
  }
};
