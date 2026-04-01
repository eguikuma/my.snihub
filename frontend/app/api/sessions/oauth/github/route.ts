import { NextResponse } from "next/server";
import {
  BffEndpoints,
  GITHUB_AUTHORIZE_URL,
  GITHUB_OAUTH_SCOPES,
} from "@/foundations/definitions";
import { InvalidEnvironmentVariable } from "@/foundations/errors";
import { toSafeRedirectPath } from "@/foundations/libraries/path";
import { session } from "@/foundations/libraries/sessions";

/**
 * GitHub OAuth フローを開始する
 *
 * state を生成してセッションに保存し、GitHub の認可画面へリダイレクトする
 */
export const GET = async (request: Request) => {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    throw new InvalidEnvironmentVariable("GITHUB_CLIENT_ID");
  }

  const currentSession = await session.get();
  const origin = new URL(request.url).origin;

  currentSession.state = crypto.randomUUID();
  currentSession.redirectTo = toSafeRedirectPath(
    request.headers.get("Referer"),
  );
  await currentSession.save();

  const redirectUri = `${origin}${BffEndpoints.OAuthGithubCallback}`;

  return NextResponse.redirect(
    `${GITHUB_AUTHORIZE_URL}?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: GITHUB_OAUTH_SCOPES,
      state: currentSession.state,
    }).toString()}`,
  );
};
