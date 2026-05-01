import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { HighlightEditorForm } from "@/components/forms/highlight-editor-form";
import { Badge } from "@/components/ui/badge";
import { requireAuthenticatedViewer } from "@/lib/server/auth";
import { getHighlightById } from "@/lib/server/repository";
import { formatDateTime } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HighlightDetailPage({ params }: Props) {
  const { id } = await params;
  const viewer = await requireAuthenticatedViewer();
  const highlight = await getHighlightById(viewer.userId, id);

  if (!highlight) {
    notFound();
  }

  return (
    <AppShell>
      <AppHeader
        eyebrow="Destaque"
        title={highlight.bookTitle}
        description={`Pagina ${highlight.pageNumber} • Capturado em ${formatDateTime(highlight.capturedAt)}`}
        actions={<Badge>{highlight.ocrStatus}</Badge>}
      />

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <HighlightEditorForm highlight={highlight} />
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-[0_16px_50px_rgba(80,54,32,0.08)]">
            {highlight.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={highlight.imageUrl}
                alt={`Pagina ${highlight.pageNumber} do livro ${highlight.bookTitle}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex min-h-80 items-center justify-center p-6 text-center text-muted-foreground">
                Imagem indisponivel para este destaque.
              </div>
            )}
          </div>
          <div className="rounded-[2rem] border border-border/70 bg-card/90 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              OCR bruto
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {highlight.rawOcrText || "Ainda nao ha texto bruto salvo para este destaque."}
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
