import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/auth";
import { getBookById } from "@/lib/server/repository";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  const viewer = await getViewerContext();
  const { id } = await context.params;
  const book = await getBookById(viewer.userId, id);

  if (!book) {
    return NextResponse.json({ error: "Livro nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ data: book });
}
