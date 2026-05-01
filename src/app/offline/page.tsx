export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-[2rem] border border-border bg-card/90 p-8 shadow-[0_18px_60px_rgba(80,54,32,0.08)]">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-secondary">
          Offline
        </p>
        <h1 className="fancy-title mt-3 text-4xl font-semibold">
          Voce esta sem conexao no momento.
        </h1>
        <p className="mt-4 text-muted-foreground">
          As paginas ja abertas podem continuar acessiveis, mas novas capturas e
          salvamentos ficam indisponiveis ate a conexao voltar.
        </p>
      </div>
    </main>
  );
}
