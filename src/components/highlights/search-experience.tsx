"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { HighlightCard } from "@/components/highlights/highlight-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { BookRecord, HighlightRecord } from "@/lib/types";

type Props = {
  books: BookRecord[];
  initialQuery: string;
  initialBookId: string;
  results: HighlightRecord[];
};

export function SearchExperience({
  books,
  initialBookId,
  initialQuery,
  results,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [bookId, setBookId] = useState(initialBookId);

  const filtered = useMemo(() => {
    return results.filter((item) => {
      const bookMatch = bookId ? item.bookId === bookId : true;
      const queryMatch = query
        ? `${item.editedText} ${item.rawOcrText} ${item.userNote}`
            .toLowerCase()
            .includes(query.toLowerCase())
        : true;

      return bookMatch && queryMatch;
    });
  }, [bookId, query, results]);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_220px_auto] md:items-end">
          <div>
            <Label htmlFor="query">Trecho ou comentario</Label>
            <Input
              id="query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: coragem, memoria, amizade..."
            />
          </div>
          <div>
            <Label htmlFor="bookId">Livro</Label>
            <Select
              id="bookId"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
            >
              <option value="">Todos os livros</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </Select>
          </div>
          <Button type="button" variant="secondary" className="gap-2">
            <SearchIcon className="h-4 w-4" />
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {filtered.length ? (
          filtered.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhum destaque corresponde aos filtros atuais.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
