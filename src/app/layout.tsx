import type { Metadata } from "next";
import "./globals.css";
import { GlobalLoading } from "@/components/GlobalLoading";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "PosterMaker — Iconic Album Poster Studio",
  description: "A professional, privacy-first web application for designing iconic album posters. Print-ready artwork with zero tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('poster-storage');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  const t = parsed?.state?.theme;
                  if (t === 'light' || t === 'dark') {
                    document.documentElement.setAttribute('data-theme', t);
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <GlobalLoading />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
