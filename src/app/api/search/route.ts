import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/auth";
import { searchHighlights } from "@/lib/server/repository";

export async function GET(request: Request) {
  const viewer = await getViewerContext();
  const { searchParams } = new URL(request.url);

  const results = await searchHighlights(viewer.userId, {
    query: searchParams.get("q") ?? undefined,
    bookId: searchParams.get("bookId") ?? undefined,
  });

  return NextResponse.json({ data: results });
}
