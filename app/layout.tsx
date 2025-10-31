import type { Metadata, Viewport } from "next";
import "./globals.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL("https://samcreds.debuguei.com.br"),
  title: {
    default: "Sam_Creds — Soluções Financeiras",
    template: "%s | Sam_Creds",
  },
  description: "Crédito responsável, análise rápida e atendimento humano.",
  applicationName: "Sam_Creds",
  keywords: [
    "Sam_Creds",
    "empréstimo",
    "crédito pessoal",
    "antecipação FGTS",
    "empréstimo CLT",
    "empréstimo Bolsa Família",
    "limpar nome",
  ],
  authors: [{ name: "Sam_Creds" }],
  creator: "Sam_Creds",
  publisher: "Sam_Creds",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://samcreds.debuguei.com.br/",
    siteName: "Sam_Creds",
    title: "Sam_Creds — Soluções Financeiras",
    description: "Crédito responsável, análise rápida e atendimento humano.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Sam_Creds" }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sam_Creds — Soluções Financeiras",
    description: "Crédito responsável, análise rápida e atendimento humano.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  category: "finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1733", // cor da barra do mobile
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-zilla text-white bg-primary-900/90 antialiased selection:bg-whatsapp/30">
        {children}
      </body>
    </html>
  );
}
