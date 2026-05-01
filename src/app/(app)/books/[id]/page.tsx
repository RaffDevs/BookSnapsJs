import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { HighlightCard } from "@/components/highlights/highlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAuthenticatedViewer } from "@/lib/server/auth";
import { getBookById } from "@/lib/server/repository";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const viewer = await requireAuthenticatedViewer();
  const book = await getBookById(viewer.userId, id);

  if (!book) {
    notFound();
  }

  return (
    <AppShell>
      <AppHeader
        eyebrow="Livro"
        title={book.title}
        description={`${book.author || "Autor nao informado"}${book.publisher ? ` • ${book.publisher}` : ""}`}
        actions={
          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/capture?bookId=${book.id}`}>Capturar pagina</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/search?bookId=${book.id}`}>Buscar neste livro</Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 rounded-[2rem] border border-border/70 bg-card/90 p-5 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">ISBN</p>
          <p className="mt-2 font-medium">{book.isbn || "Nao informado"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Paginas</p>
          <p className="mt-2 font-medium">
            {book.totalPages ? `${book.totalPages} paginas` : "Nao informado"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Destaques</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="font-medium">{book.highlights.length}</p>
            <Badge>{book.highlights.length === 1 ? "trecho" : "trechos"}</Badge>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        {book.highlights.length ? (
          book.highlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))
        ) : (
          <EmptyState
            title="Nenhuma pagina capturada ainda"
            description="A primeira foto deste livro vai aparecer aqui com OCR, nota pessoal e acesso rapido ao detalhe."
            actionLabel="Capturar primeira pagina"
            href={`/capture?bookId=${book.id}`}
          />
        )}
      </section>
    </AppShell>
  );
}
