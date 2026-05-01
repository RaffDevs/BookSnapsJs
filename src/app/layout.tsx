import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegistry } from "@/components/pwa/pwa-registry";

export const metadata: Metadata = {
  metadataBase: new URL("https://booksnaps.local"),
  title: {
    default: "BookSnaps",
    template: "%s | BookSnaps",
  },
  description:
    "Capture, organize, and search highlights from physical books with OCR and mobile-first workflows.",
  applicationName: "BookSnaps",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BookSnaps",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f2e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="grain min-h-screen antialiased">
        <PwaRegistry />
        {children}
      </body>
    </html>
  );
}
