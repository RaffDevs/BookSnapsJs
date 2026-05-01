import type { ReactNode } from "react";

type AppHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function AppHeader({
  eyebrow,
  title,
  description,
  actions,
}: AppHeaderProps) {
  return (
    <section className="page-shell rounded-[2rem] border border-border/70 px-5 py-6 shadow-[0_18px_60px_rgba(80,54,32,0.08)] md:px-7 md:py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-secondary">
            {eyebrow}
          </p>
          <h1 className="fancy-title mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </section>
  );
}
