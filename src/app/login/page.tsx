import { BookOpenText, Camera, Search } from "lucide-react";
import { AuthActions } from "@/components/auth/auth-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewerContext } from "@/lib/server/auth";

const features = [
  {
    icon: BookOpenText,
    title: "Cadastre sua biblioteca",
    description: "Guarde titulo, autor, pagina e contexto de cada leitura.",
  },
  {
    icon: Camera,
    title: "Capture paginas pelo celular",
    description: "Envie fotos, rode OCR e revise o texto antes de salvar.",
  },
  {
    icon: Search,
    title: "Encontre qualquer citacao depois",
    description: "Busque por trecho, comentario pessoal ou livro sem depender da memoria.",
  },
];

export default async function LoginPage() {
  const viewer = await getViewerContext();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-4 py-10 md:flex-row md:items-center">
      <section className="flex-1 rounded-[2rem] border border-border/60 bg-card/85 p-8 shadow-[0_24px_80px_rgba(90,58,33,0.08)]">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-secondary">
          BookSnaps
        </p>
        <h1 className="fancy-title mt-4 text-5xl font-semibold leading-tight md:text-6xl">
          Leitura fisica com memoria digital.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Transforme paginas do mundo real em destaques pesquisaveis, com OCR,
          notas pessoais e acesso rapido no celular.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-background/85">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-md">
        <AuthActions demoMode={viewer.isDemoMode} />
      </section>
    </main>
  );
}
