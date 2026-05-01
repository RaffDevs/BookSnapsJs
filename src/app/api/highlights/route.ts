import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/auth";
import { createHighlight } from "@/lib/server/repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A imagem da pagina e obrigatoria." }, { status: 400 });
    }

    const highlight = await createHighlight(viewer.userId, {
      bookId: String(formData.get("bookId") ?? ""),
      pageNumber: Number(formData.get("pageNumber") ?? 0),
      userNote: String(formData.get("userNote") ?? ""),
      image: file,
      ocrLanguage: String(formData.get("ocrLanguage") ?? "pt,en"),
    });

    return NextResponse.json({ data: highlight }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nao foi possivel processar o destaque." },
      { status: 400 },
    );
  }
}
