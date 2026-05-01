import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { BookCard } from "@/components/books/book-card";
import { HighlightCard } from "@/components/highlights/highlight-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAuthenticatedViewer } from "@/lib/server/auth";
import { listBooks, listRecentHighlights } from "@/lib/server/repository";

export default async function DashboardPage() {
  const viewer = await requireAuthenticatedViewer();

  const [books, highlights] = await Promise.all([
    listBooks(viewer.userId),
    listRecentHighlights(viewer.userId),
  ]);

  return (
    <AppShell>
      <AppHeader
        eyebrow={viewer.isDemoMode ? "Modo de demonstracao" : "Sua biblioteca"}
        title="Seus livros, sempre ao alcance da memoria."
        description="Fotografe trechos, revise o OCR e encontre citacoes de livros fisicos como se estivesse usando um Kindle."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/books/new">Cadastrar livro</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={books[0] ? `/capture?bookId=${books[0].id}` : "/books/new"}>
                Capturar pagina
              </Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] border border-border/70 bg-card/90 p-5 shadow-[0_18px_60px_rgba(80,54,32,0.08)]">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Biblioteca
              </p>
              <h2 className="fancy-title mt-2 text-3xl font-semibold">
                Seus livros cadastrados
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/books">Ver tudo</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {books.length ? (
              books.slice(0, 4).map((book) => <BookCard key={book.id} book={book} />)
            ) : (
              <EmptyState
                title="Nenhum livro por aqui ainda"
                description="Comece cadastrando um livro para ja capturar a primeira pagina destacada."
                actionLabel="Cadastrar primeiro livro"
                href="/books/new"
              />
            )}
          </div>
        </div>

        <div className="page-shell rounded-[2rem] border border-border/70 p-5 shadow-[0_18px_60px_rgba(80,54,32,0.06)]">
          <div className="mb-5">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Destaques recentes
            </p>
            <h2 className="fancy-title mt-2 text-3xl font-semibold">
              O que voce capturou por ultimo
            </h2>
          </div>
          <div className="grid gap-3">
            {highlights.length ? (
              highlights
                .slice(0, 4)
                .map((highlight) => (
                  <HighlightCard key={highlight.id} highlight={highlight} compact />
                ))
            ) : (
              <EmptyState
                title="Sem destaques ainda"
                description="Depois da primeira captura, seus trechos revisados aparecem aqui."
                actionLabel="Abrir captura"
                href={books[0] ? `/capture?bookId=${books[0].id}` : "/books/new"}
              />
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
