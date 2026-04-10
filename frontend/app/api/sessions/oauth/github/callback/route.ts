import { NextResponse } from "next/server";
import { z } from "zod";
import { Endpoints, OAUTH_FAILED, Routes } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { session } from "@/foundations/libraries/sessions";
import { User, type Token } from "@/foundations/schemas";

const MeResponse = z.object({
  data: User,
});

/**
 * GitHub OAuth コールバックを処理する
 *
 * state を検証し、認可コードをバックエンドに送信してトークンを取得する
 * 取得したトークンでユーザー情報もセッションに保存し、以降のAPIコールを削減する
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const currentSession = await session.get();

  if (!code || !state || state !== currentSession.state) {
    return NextResponse.redirect(`${origin}/${OAUTH_FAILED}`);
  }

  try {
    const response = (await fetcher.post(Endpoints.OAuthGithub, {
      body: JSON.stringify({ code }),
    })) as { token: Token };

    currentSession.token = response.token;
  } catch {
    return NextResponse.redirect(`${origin}/${OAUTH_FAILED}`);
  }

  try {
    const response = await fetcher.get(Endpoints.Me);
    const user = MeResponse.parse(response).data;
    currentSession.user = user;
    currentSession.ownerHash = user.owner_hash;
  } catch (error) {
    console.error("[OAuthCallback] /api/me failed:", error);
  }

  const redirectTo = currentSession.redirectTo ?? Routes.Snippets;
  delete currentSession.state;
  delete currentSession.redirectTo;

  await currentSession.save();

  return NextResponse.redirect(`${origin}${redirectTo}`);
};
