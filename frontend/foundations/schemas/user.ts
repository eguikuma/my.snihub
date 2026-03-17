import { z } from "zod";

/**
 * ユーザーを表現するスキーマ
 */
export const UserSchema = z.object({
  name: z.string(),
  email: z.nullable(z.string()),
  avatar_url: z.nullable(z.string()),
  providers: z.array(z.string()),
  created_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;
