import { NextResponse } from "next/server";
import { Endpoints, OAUTH_FAILED, Routes } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { session } from "@/foundations/libraries/sessions";
import type { Token } from "@/foundations/schemas";

/**
 * GitHub OAuth コールバックを処理する
 *
 * state を検証し、認可コードをバックエンドに送信してトークンを取得する
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

  const redirectTo = currentSession.redirectTo ?? Routes.Snippets;
  delete currentSession.state;
  delete currentSession.redirectTo;

  await currentSession.save();

  return NextResponse.redirect(`${origin}${redirectTo}`);
};
