import Link from "next/link";
import { BookMarked, Camera, Home, Search } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/books", label: "Livros", icon: BookMarked },
  { href: "/capture", label: "Capturar", icon: Camera },
  { href: "/search", label: "Buscar", icon: Search },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-1.5rem)] max-w-md items-center justify-between rounded-full border border-border/70 bg-card/92 px-3 py-2 shadow-[0_18px_50px_rgba(70,43,24,0.12)] backdrop-blur">
      {items.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full px-2 py-2 text-center text-[11px] font-medium text-muted-foreground transition hover:text-primary"
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
