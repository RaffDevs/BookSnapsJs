"use client";

import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookSchema } from "@/lib/validations";

type FormState = {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  totalPages: string;
};

export function BookForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    totalPages: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setErrors({});

    const parsed = createBookSchema.safeParse({
      title: form.title,
      author: form.author,
      publisher: form.publisher,
      isbn: form.isbn,
      totalPages: form.totalPages ? Number(form.totalPages) : undefined,
    });

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
        ),
      );
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Nao foi possivel criar o livro.");
        return;
      }

      router.push(`/books/${payload.data.id}`);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary">
          Cadastro manual
        </p>
        <CardTitle className="mt-2">Informacoes essenciais do livro.</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Titulo"
              error={errors.title}
              input={
                <Input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="A coragem de ser imperfeito"
                />
              }
            />
            <Field
              label="Autor"
              error={errors.author}
              input={
                <Input
                  value={form.author}
                  onChange={(event) => updateField("author", event.target.value)}
                  placeholder="Brene Brown"
                />
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Editora"
              error={errors.publisher}
              input={
                <Input
                  value={form.publisher}
                  onChange={(event) => updateField("publisher", event.target.value)}
                  placeholder="Editora..."
                />
              }
            />
            <Field
              label="ISBN"
              error={errors.isbn}
              input={
                <Input
                  value={form.isbn}
                  onChange={(event) => updateField("isbn", event.target.value)}
                  placeholder="978..."
                />
              }
            />
          </div>
          <Field
            label="Total de paginas"
            error={errors.totalPages}
            input={
              <Input
                type="number"
                value={form.totalPages}
                onChange={(event) => updateField("totalPages", event.target.value)}
                placeholder="320"
              />
            }
          />
          {error ? (
            <p className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar livro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: ReactNode;
  error?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {input}
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
