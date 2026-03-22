import { NextResponse } from "next/server";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Endpoints } from "@/foundations/definitions";

/**
 * コールドスタートを防止するためにバックエンドのヘルスチェックを定期的に実行する
 */
export const GET = async () => {
  if (!process.env.BACKEND_URL) {
    return NextResponse.json(ReasonPhrases.SERVICE_UNAVAILABLE, {
      status: StatusCodes.SERVICE_UNAVAILABLE,
    });
  }

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}${Endpoints.Health}`,
      {
        cache: "no-store",
      },
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(ReasonPhrases.SERVICE_UNAVAILABLE, {
      status: StatusCodes.SERVICE_UNAVAILABLE,
    });
  }
};
