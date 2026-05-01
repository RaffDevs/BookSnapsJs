import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAuthenticatedViewer } from "@/lib/server/auth";
import { listBooks } from "@/lib/server/repository";

export default async function BooksPage() {
  const viewer = await requireAuthenticatedViewer();
  const books = await listBooks(viewer.userId);

  return (
    <AppShell>
      <AppHeader
        eyebrow="Biblioteca"
        title="Todos os seus livros em um so lugar."
        description="Acompanhe sua colecao cadastrada e abra cada livro para consultar ou capturar novos destaques."
        actions={
          <Button asChild>
            <Link href="/books/new">Novo livro</Link>
          </Button>
        }
      />
      <section className="grid gap-4">
        {books.length ? (
          books.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          <EmptyState
            title="Sua biblioteca ainda esta vazia"
            description="Cadastre um livro para comecar a indexar trechos, comentarios e paginas marcantes."
            actionLabel="Cadastrar livro"
            href="/books/new"
          />
        )}
      </section>
    </AppShell>
  );
}
