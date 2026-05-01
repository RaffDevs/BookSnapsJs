"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  demoMode: boolean;
};

export function AuthActions({ demoMode }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleMagicLink() {
    if (demoMode) {
      setStatus("Modo demo ativo. Configure o Supabase para habilitar autenticacao real.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("Supabase nao configurado no cliente.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(
      error
        ? error.message
        : `Magic link enviado para ${email}. Verifique seu email para continuar.`,
    );
  }

  async function handleGoogle() {
    const supabase = createSupabaseBrowserClient();

    setStatus(
      demoMode
        ? "Modo demo ativo. O login social fica disponivel assim que as credenciais do Supabase forem configuradas."
        : "Redirecionando para o Google...",
    );

    if (demoMode || !supabase) {
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <Card className="bg-card/92">
      <CardHeader>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-secondary">
          Entrar
        </p>
        <CardTitle className="mt-2">Acesse sua estante digital.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button className="w-full" onClick={handleMagicLink}>
          Enviar magic link
        </Button>
        <Button className="w-full" variant="outline" onClick={handleGoogle}>
          Entrar com Google
        </Button>
        <p className="text-sm leading-7 text-muted-foreground">
          {demoMode
            ? "O projeto sobe em modo demonstracao quando as variaveis do Supabase ainda nao foram configuradas."
            : "Depois de configurar o Supabase, ligue estas acoes aos metodos reais do provedor."}
        </p>
        {status ? (
          <p className="rounded-[1.25rem] bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
            {status}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
