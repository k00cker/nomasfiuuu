"use client";

import React from "react";
import Logo from "@/components/Logo";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
          <Logo iconOnly className="scale-125 mb-6" />
          
          <h2 className="font-extrabold text-2xl text-brand-navy mb-4 leading-snug">
            Ha ocurrido un problema
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Lo sentimos, el sistema experimentó un error inesperado al procesar la solicitud.
          </p>

          <button
            onClick={() => reset()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-base font-bold shadow-md hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
