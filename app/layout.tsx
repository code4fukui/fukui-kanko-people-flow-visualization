import { ExternalNavigaton } from "@/components/parts/external-navigation.component";
import "./globals.css";
import { GraphIcon } from "@primer/octicons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "福井県 観光オープンデータグラフ",
  description:
    "Code4Fukuiなどによって公開されているオープンデータから観光に関するデータの可視化を行います",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="data:image/x-icon;," />
      </head>
      <body className="h-full w-full antialiased">
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
          <header className="border-separator flex h-12 w-full items-center justify-between gap-x-2 border-b-2 pb-2">
            <Link
              className="group flex h-fit w-fit items-center justify-start gap-x-2 no-underline"
              href="/"
              rel="noopener noreferrer"
            >
              <GraphIcon
                size="medium"
                verticalAlign="top"
                className="group-hover:scale-120 fill-primary transition-all"
              />
              <h1 className="text-2xl font-bold transition-all group-hover:scale-110 group-hover:underline">
                福井観光DX:グラフ
              </h1>
            </Link>
            <ExternalNavigaton />
          </header>
          <main className="flex h-full w-full max-w-full flex-grow items-center pt-4">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
