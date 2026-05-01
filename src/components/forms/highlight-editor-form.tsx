"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { HighlightRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function HighlightEditorForm({ highlight }: { highlight: HighlightRecord }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editedText, setEditedText] = useState(highlight.editedText);
  const [userNote, setUserNote] = useState(highlight.userNote);
  const [pageNumber, setPageNumber] = useState(String(highlight.pageNumber));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);
    setMessage("Salvando ajustes...");

    startTransition(async () => {
      const response = await fetch(`/api/highlights/${highlight.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editedText,
          userNote,
          pageNumber: Number(pageNumber),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Nao foi possivel atualizar o destaque.");
        setMessage(null);
        return;
      }

      setMessage("Destaque salvo com sucesso.");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary">
          Revisao final
        </p>
        <CardTitle className="mt-2">Ajuste o OCR antes de arquivar.</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <Label htmlFor="pageNumber">Pagina</Label>
          <Input
            id="pageNumber"
            type="number"
            min={1}
            value={pageNumber}
            onChange={(event) => setPageNumber(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="editedText">Texto extraido</Label>
          <Textarea
            id="editedText"
            className="min-h-64"
            value={editedText}
            onChange={(event) => setEditedText(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="userNote">Comentario pessoal</Label>
          <Textarea
            id="userNote"
            value={userNote}
            onChange={(event) => setUserNote(event.target.value)}
            placeholder="Adicione sua interpretacao, contexto ou uma futura aplicacao deste trecho."
          />
        </div>
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
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alteracoes"}
        </Button>
      </CardContent>
    </Card>
  );
}
