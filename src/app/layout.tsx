import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "No Más FSCU | Defensa Legal Especializada - GMEC Abogados",
  description: "Evaluamos la prescripción de tu deuda del Fondo Solidario a los 5 años y te defendemos ante cobranzas judiciales en todo Chile de forma 100% remota.",
  keywords: [
    "FSCU",
    "Fondo Solidario de Crédito Universitario",
    "Prescripción de Deuda FSCU",
    "GMEC Abogados",
    "Defensa Legal Chile",
    "Retención de Impuestos TGR",
    "Demanda Fondo Solidario",
    "Prescripción 5 años Chile"
  ],
  authors: [{ name: "GMEC Abogados" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
