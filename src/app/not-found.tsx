import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[70vh] bg-slate-50">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-2xl flex flex-col items-center text-center max-w-lg w-full">
        <Logo className="mb-8" />
        
        <h1 className="text-6xl font-black text-brand-navy mb-4">404</h1>
        <h2 className="text-2xl font-extrabold text-brand-navy mb-4 leading-snug">
          Página no encontrada
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          Lo sentimos, la página que estás buscando no existe, ha sido eliminada o cambió de dirección.
        </p>

        <Link
          href="/"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-green text-white text-base font-bold shadow-lg hover:opacity-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
