import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
}: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border bg-background/80 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <BookOpenText className="h-6 w-6" />
      </div>
      <h3 className="fancy-title mt-4 text-3xl font-semibold">{title}</h3>
      <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">
        {description}
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
