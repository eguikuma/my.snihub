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

  throw new Error("[Sentry Test] api route error");
};
