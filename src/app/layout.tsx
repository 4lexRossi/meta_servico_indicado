import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488",
};

export const metadata: Metadata = {
  title: "Serviço Indicado - Profissionais de Confiança para sua Casa",
  description: "Encontre pedreiros, encanadores, eletricistas, pintores, montadores de móveis e chaveiros verificados e recomendados perto de você. Contato direto via WhatsApp.",
  keywords: ["serviço indicado", "encanador", "eletricista", "montador de móveis", "pedreiro", "pintor", "marido de aluguel", "reforma", "reparos"],
  authors: [{ name: "Serviço Indicado" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
