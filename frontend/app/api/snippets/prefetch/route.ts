import { NextResponse, type NextRequest } from "next/server";
import { session } from "@/foundations/libraries/sessions";
import { Slug } from "@/foundations/schemas";
import { fetchMySnippet } from "@/features/viewer/actions/fetch-my-snippet";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";

/**
 * スニペットのData Cacheを事前に温めるためのRoute Handler
 *
 * Server Actionと異なりRSCツリーのリフレッシュをトリガーしないため
 * 一覧ページの不要な再取得を防止できる
 */
export const GET = async (request: NextRequest) => {
  const rawSlug = request.nextUrl.searchParams.get("slug");

  if (!rawSlug) {
    return new NextResponse(null, { status: 400 });
  }

  const slug = Slug.from(rawSlug);
  const currentSession = await session.get();

  if (currentSession.ownerHash) {
    await fetchMySnippet(slug, currentSession.ownerHash);
  } else {
    await fetchSnippet(slug);
  }

  return new NextResponse(null, { status: 204 });
};
