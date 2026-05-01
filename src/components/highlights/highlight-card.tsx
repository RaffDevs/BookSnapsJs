import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HighlightRecord } from "@/lib/types";
import { formatDateTime, truncate } from "@/lib/utils";

type HighlightCardProps = {
  highlight: HighlightRecord;
  compact?: boolean;
};

export function HighlightCard({ highlight, compact = false }: HighlightCardProps) {
  return (
    <Link href={`/highlights/${highlight.id}`}>
      <Card className="transition hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(70,43,24,0.1)]">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <CardTitle className={compact ? "text-2xl" : undefined}>
              {highlight.bookTitle}
            </CardTitle>
            <p className="mt-3 text-sm text-muted-foreground">
              Pagina {highlight.pageNumber} • {formatDateTime(highlight.capturedAt)}
            </p>
          </div>
          <Badge>{highlight.ocrStatus}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-7 text-foreground">
            {truncate(
              highlight.editedText || highlight.rawOcrText || "Sem texto disponivel.",
              compact ? 160 : 260,
            )}
          </p>
          {highlight.userNote ? (
            <p className="rounded-[1.25rem] bg-muted/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
              {truncate(highlight.userNote, compact ? 100 : 180)}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
