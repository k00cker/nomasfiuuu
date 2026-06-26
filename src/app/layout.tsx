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
  // ── Básico ────────────────────────────────────────────────────────────────
  metadataBase: new URL('https://nomasfscu.cl'),
  title: {
    default: 'No Más FSCU | Abogados Especialistas en Deuda Fondo Solidario Chile',
    template: '%s | GMEC Abogados — nomasfscu.cl',
  },
  description:
    'Abogados especialistas en prescripción de deudas del Fondo Solidario (FSCU) y defensa ante cobranzas judiciales. Evaluamos tu caso gratis. Atención 100% remota en todo Chile.',
  keywords: [
    // Keywords primarias (alta intención transaccional)
    'abogados deuda FSCU Chile',
    'prescripción deuda fondo solidario',
    'defensa legal fondo solidario',
    'GMEC Abogados',
    // Keywords secundarias (informacionales de alta urgencia)
    'qué pasa si no pago el fondo solidario',
    'retención TGR fondo solidario',
    'retención impuestos fondo solidario',
    'vendieron mi deuda fondo solidario',
    // Long-tail de alta conversión
    'prescripción 5 años deuda universitaria Chile',
    'abogados deuda universitaria remoto Chile',
    'defensa ante demanda fondo solidario',
    'liberación retención TGR abogados',
    // Branding y dominio
    'no más FSCU',
    'nomasfscu',
    'FSCU Fondo Solidario Crédito Universitario',
  ],
  authors: [{ name: 'GMEC Abogados', url: 'https://nomasfscu.cl' }],
  creator: 'GMEC Abogados',
  publisher: 'GMEC Abogados',
  category: 'Servicios Legales — Defensa de Deudores',

  // ── Canónica e Indexación ──────────────────────────────────────────────────
  alternates: {
    canonical: 'https://nomasfscu.cl/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://nomasfscu.cl/',
    siteName: 'No Más FSCU — GMEC Abogados',
    title: '¿Te cobran el FSCU o te retuyeron la devolución? Evalúa tu caso gratis',
    description:
      'Somos abogados especializados en deudas del Fondo Solidario Universitario. Analizamos prescripción, demandas y retenciones TGR. Cobertura nacional, atención 100% remota.',
    images: [
      {
        url: '/img/og-nomasfscu.jpg',
        width: 1200,
        height: 630,
        alt: 'No Más FSCU — GMEC Abogados: Defensa Legal Especializada en Chile',
        type: 'image/jpeg',
      },
    ],
  },

  // ── Twitter / X Cards ──────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: '¿Deuda del Fondo Solidario? Conoce tus derechos legales',
    description:
      'Prescripción a los 5 años, defensa ante demandas y liberación de retenciones TGR. Abogados especializados en FSCU — atención 100% remota en Chile.',
    images: ['/img/og-nomasfscu.jpg'],
    creator: '@GMECAbogados',
  },

  // ── Verificación GSC (activar cuando esté disponible el token) ─────────────
  // verification: {
  //   google: 'PEGAR_TOKEN_GOOGLE_SEARCH_CONSOLE',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "GMEC Abogados",
    "image": "https://nomasfscu.cl/img/gmecLOGO.jpeg",
    "telephone": "+56963064291",
    "email": "contacto@gmecspa.cl",
    "url": "https://nomasfscu.cl",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CL"
    },
    "description": "Estudio jurídico especializado en la prescripción de deudas de Fondo Solidario de Crédito Universitario (FSCU) y defensa legal ante cobranzas en Chile."
  };

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
