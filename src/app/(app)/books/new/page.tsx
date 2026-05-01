import { AppHeader } from "@/components/layout/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { BookForm } from "@/components/forms/book-form";

export default function NewBookPage() {
  return (
    <AppShell>
      <AppHeader
        eyebrow="Novo livro"
        title="Cadastre um livro da sua estante."
        description="No V1 o cadastro e manual. Voce pode informar so o essencial e complementar o resto depois."
      />
      <BookForm />
    </AppShell>
  );
}
