import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { Snippet } from "@/foundations/schemas";

const SnippetResponse = z.object({
  data: Snippet,
});

/**
 * 認証済みユーザーのスニペットをslug指定で取得し、失敗時はnullを返す
 */
export const fetchMySnippet = async (slug: string): Promise<Snippet | null> => {
  try {
    const response = await fetcher.get(Endpoints.MySnippet(slug));

    return SnippetResponse.parse(response).data;
  } catch {
    return null;
  }
};
