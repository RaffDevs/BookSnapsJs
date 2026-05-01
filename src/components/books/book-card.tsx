import Link from "next/link";
import { Book, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookRecord } from "@/lib/types";

export function BookCard({ book }: { book: BookRecord }) {
  return (
    <Link href={`/books/${book.id}`}>
      <Card className="transition hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(70,43,24,0.1)]">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Book className="h-5 w-5" />
            </div>
            <CardTitle>{book.title}</CardTitle>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {book.author || "Autor nao informado"}
            </p>
          </div>
          <Badge>{book.highlightCount} destaques</Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{book.publisher || "Editora nao informada"}</span>
          <span className="inline-flex items-center gap-2">
            <Quote className="h-4 w-4" />
            {book.totalPages ? `${book.totalPages} pags.` : "paginas livres"}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
