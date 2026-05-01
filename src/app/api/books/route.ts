import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/auth";
import { createBook, listBooks } from "@/lib/server/repository";
import { createBookSchema } from "@/lib/validations";

export async function GET() {
  const viewer = await getViewerContext();
  const books = await listBooks(viewer.userId);

  return NextResponse.json({ data: books, meta: { demoMode: viewer.isDemoMode } });
}

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();
    const payload = createBookSchema.parse(await request.json());
    const book = await createBook(viewer.userId, payload);

    return NextResponse.json({ data: book }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nao foi possivel criar o livro." },
      { status: 400 },
    );
  }
}
