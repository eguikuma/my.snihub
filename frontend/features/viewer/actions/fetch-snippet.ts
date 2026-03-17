import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { Snippet } from "@/foundations/schemas";

const SnippetResponse = z.object({
  data: Snippet,
});

/**
 * 指定されたslugのスニペットをバックエンドから取得し、失敗時はnullを返す
 */
export const fetchSnippet = async (slug: string): Promise<Snippet | null> => {
  try {
    const response = await fetcher.get(Endpoints.Snippet(slug));

    return SnippetResponse.parse(response).data;
  } catch {
    return null;
  }
};
