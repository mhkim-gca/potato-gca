import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "감자마켓 — 프리미엄 빈티지 중고마켓",
  description:
    "프리미엄 구제샵. 감자마켓에서 시간이 깃든 물건을 사고팔아요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=Oswald:wght@400;500;600&family=Gowun+Batang:wght@400;700&family=Gothic+A1:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <div className="retro-topbar" />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line/80 py-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-5 text-center">
            <p className="eyebrow text-[11px] text-rust">감자마켓 · Potato Market</p>
            <p className="text-xs text-ink-soft">
              시간이 깃든 물건을 위한 자리 
            </p>
            <p className="mt-2 text-[11px] text-ink-soft/70">
              개발 학습용 프로젝트 ·{" "}
              <Link href="/" className="underline-offset-2 hover:underline">
                home
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
