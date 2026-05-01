import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { HighlightCaptureForm } from "@/components/forms/highlight-capture-form";
import { requireAuthenticatedViewer } from "@/lib/server/auth";
import { listBooks } from "@/lib/server/repository";

type Props = {
  searchParams: Promise<{ bookId?: string }>;
};

export default async function CapturePage({ searchParams }: Props) {
  const viewer = await requireAuthenticatedViewer();
  const books = await listBooks(viewer.userId);
  const params = await searchParams;

  return (
    <AppShell>
      <AppHeader
        eyebrow="Captura"
        title="Transforme uma pagina em destaque digital."
        description="Envie a foto, informe a pagina e deixe o OCR preparar uma versao editavel do trecho."
      />
      <HighlightCaptureForm books={books} initialBookId={params.bookId} />
    </AppShell>
  );
}
