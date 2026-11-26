import type { Metadata } from "next";
import "./globals.css";
import { GlobalLoading } from "@/components/GlobalLoading";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Pressroom — Music Print Studio",
  description: "Make Music Visible. An independent music print studio—turn the albums you love into prints worth keeping, with 300 DPI export and zero tracking.",
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: "Pressroom — Music Print Studio",
    description: "Make Music Visible. An independent music print studio.",
    images: ['/brand/pressroom-lockup-horizontal.jpg'],
  },
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
