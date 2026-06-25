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
  // ── Básico ──────────────────────────────────────────────────────────────
  metadataBase: new URL('https://nomasfscu.cl'),
  title: {
    default: 'No Más FSCU | Defensa Legal Especializada — GMEC Abogados',
    template: '%s | GMEC Abogados',
  },
  description:
    'Evaluamos la prescripción de tu deuda del Fondo Solidario a los 5 años y te defendemos ante cobranzas judiciales en todo Chile de forma 100% remota.',
  keywords: [
    'FSCU',
    'Fondo Solidario de Crédito Universitario',
    'prescripción deuda FSCU',
    'GMEC Abogados',
    'defensa legal Chile',
    'retención impuestos TGR',
    'demanda Fondo Solidario',
    'prescripción 5 años',
    'abogados deuda universitaria',
    'cobranza FSCU Chile',
  ],
  authors: [{ name: 'GMEC Abogados', url: 'https://nomasfscu.cl' }],
  creator: 'GMEC Abogados',
  publisher: 'GMEC Abogados',
  category: 'Servicios Legales',

  // ── Canónica e Indexación ────────────────────────────────────────────────
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

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://nomasfscu.cl/',
    siteName: 'No Más FSCU — GMEC Abogados',
    title: '¿Te siguen cobrando el FSCU? Evalúa tu caso gratis',
    description:
      'Defensa legal especializada para deudores del Fondo Solidario. Prescripción a los 5 años, defensa ante demandas y liberación de retenciones TGR. Cobertura nacional, 100% remoto.',
    images: [
      {
        url: '/img/og-nomasfscu.jpg',
        width: 1200,
        height: 630,
        alt: 'No Más FSCU — GMEC Abogados: Defensa Legal Especializada en Chile',
      },
    ],
  },

  // ── Twitter / X Cards ────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: '¿Te siguen cobrando el FSCU? Conoce tus derechos',
    description:
      'Evaluamos la prescripción de tu deuda universitaria. Defensa ante cobranzas y retenciones TGR en todo Chile. Atención 100% remota — GMEC Abogados.',
    images: ['/img/og-nomasfscu.jpg'],
    creator: '@GMECAbogados',
  },
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
