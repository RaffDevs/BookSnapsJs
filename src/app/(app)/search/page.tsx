import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { SearchExperience } from "@/components/highlights/search-experience";
import { requireAuthenticatedViewer } from "@/lib/server/auth";
import { listBooks, searchHighlights } from "@/lib/server/repository";

type Props = {
  searchParams: Promise<{ q?: string; bookId?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const viewer = await requireAuthenticatedViewer();
  const params = await searchParams;
  const books = await listBooks(viewer.userId);
  const results = await searchHighlights(viewer.userId, {
    query: params.q,
    bookId: params.bookId,
  });

  return (
    <AppShell>
      <AppHeader
        eyebrow="Busca"
        title="Encontre frases sem depender da memoria."
        description="Busque por trecho OCR, nota pessoal ou filtre por um livro especifico."
      />
      <SearchExperience
        books={books}
        initialQuery={params.q ?? ""}
        initialBookId={params.bookId ?? ""}
        results={results}
      />
    </AppShell>
  );
}
