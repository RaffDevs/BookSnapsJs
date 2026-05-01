import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/auth";
import { getHighlightById, updateHighlight } from "@/lib/server/repository";
import { updateHighlightSchema } from "@/lib/validations";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  const viewer = await getViewerContext();
  const { id } = await context.params;
  const highlight = await getHighlightById(viewer.userId, id);

  if (!highlight) {
    return NextResponse.json({ error: "Destaque nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ data: highlight });
}

export async function PATCH(request: Request, context: Context) {
  try {
    const viewer = await getViewerContext();
    const { id } = await context.params;
    const payload = updateHighlightSchema.parse(await request.json());
    const highlight = await updateHighlight(viewer.userId, id, payload);

    return NextResponse.json({ data: highlight });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nao foi possivel atualizar o destaque." },
      { status: 400 },
    );
  }
}
