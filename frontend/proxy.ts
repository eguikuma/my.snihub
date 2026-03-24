import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import {
  SessionOptions,
  type Session,
} from "@/foundations/libraries/session-options";

/**
 * 認証が必要なルートパターン
 */
const ProtectedRoutes = ["/snippets/mine", "/snippets/new"];

/**
 * 認証が必要なルートへの未認証アクセスをリダイレクトする
 */
export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isProtected = ProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const currentSession = await getIronSession<Session>(
    request,
    response,
    SessionOptions,
  );

  if (!currentSession.token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};

export const config = {
  matcher: ["/snippets/:path*"],
};
