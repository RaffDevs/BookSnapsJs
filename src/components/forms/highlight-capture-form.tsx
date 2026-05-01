"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BookRecord } from "@/lib/types";

type Props = {
  books: BookRecord[];
  initialBookId?: string;
};

export function HighlightCaptureForm({ books, initialBookId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bookId, setBookId] = useState(initialBookId ?? books[0]?.id ?? "");
  const canSubmit = useMemo(() => books.length > 0 && bookId, [bookId, books.length]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setMessage("Enviando imagem e iniciando OCR...");

    const response = await fetch("/api/highlights", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Nao foi possivel processar a captura.");
      setMessage(null);
      return;
    }

    setMessage("OCR concluido. Abrindo o destaque para revisao.");
    router.push(`/highlights/${payload.data.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary">
          OCR da pagina
        </p>
        <CardTitle className="mt-2">Capture, revise e salve.</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-background/80 p-6 text-center text-muted-foreground">
            Cadastre um livro antes de iniciar a captura.
          </div>
        ) : (
          <form
            className="grid gap-4"
            action={(formData) =>
              startTransition(async () => {
                await handleSubmit(formData);
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="bookId">Livro</Label>
                <Select
                  id="bookId"
                  name="bookId"
                  value={bookId}
                  onChange={(event) => setBookId(event.target.value)}
                >
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="pageNumber">Numero da pagina</Label>
                <Input id="pageNumber" name="pageNumber" type="number" min={1} required />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Foto da pagina</Label>
              <label
                htmlFor="image"
                className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border bg-background/85 px-5 py-8 text-center"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Previa da captura"
                    className="max-h-80 w-full rounded-[1.25rem] object-cover"
                  />
                ) : (
                  <>
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                      <Camera className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Toque para tirar foto ou fazer upload</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Aceita JPG, PNG e WEBP ate 10 MB.
                    </p>
                  </>
                )}
              </label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                capture="environment"
                className="sr-only"
                required
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    setPreview(null);
                    return;
                  }

                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <div>
              <Label htmlFor="userNote">Comentario pessoal (opcional)</Label>
              <Textarea
                id="userNote"
                name="userNote"
                placeholder="Qual o contexto deste trecho? Por que ele importa para voce?"
              />
            </div>

            <input type="hidden" name="ocrLanguage" value="pt,en" />

            {message ? (
              <p className="rounded-[1.25rem] bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={isPending || !canSubmit} className="gap-2">
              <Upload className="h-4 w-4" />
              {isPending ? "Processando..." : "Enviar e rodar OCR"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
