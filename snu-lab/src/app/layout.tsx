import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "μNOEL · SNU Photonics Lab",
  description: "Moiré Nano-Optics & Electronics Laboratory (μNOEL) at Seoul National University"
};

const navItems = [
  { href: "/people", label: "People" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/news", label: "News" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 text-sm font-medium">
            <Link href="/" className="flex flex-col text-base font-semibold text-gray-900">
              μNOEL
              <span className="text-xs font-normal text-gray-500">Micro &amp; Nano Opto-Electronics Lab</span>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-600 hover:text-gray-900">
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="ml-auto text-xs text-gray-300 transition hover:text-gray-500"
              aria-label="Admin"
            >
              Admin
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="mt-16 border-t bg-gray-50">
          <div className="mx-auto flex max-w-6xl gap-4 px-4 py-6 text-sm text-gray-600">
            <div className="flex-shrink-0">
              <Image src="/images/snu-logo.png" alt="Seoul National University logo" width={96} height={96} />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">Micro &amp; Nano Opto-Electronics Lab (μNOEL)</p>
              <p>
                Department of Physics &amp; Astronomy, Seoul National University · 56-323, 1 Gwanak-ro,
                Gwanak-gu, Seoul 08826, Korea
              </p>
              <p>Tel. +82-2-880-6265 · Fax +82-2-874-3936</p>
              <p>© {new Date().getFullYear()} Micro &amp; Nano Opto-Electronics Lab · Seoul National University</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
