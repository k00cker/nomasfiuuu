import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "", iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon Symbol */}
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10 md:w-11 md:h-11 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue gradient for the crescent moon */}
          <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052D4" />
            <stop offset="50%" stopColor="#0079D9" />
            <stop offset="100%" stopColor="#00C2C2" />
          </linearGradient>
          {/* Green gradient for the checkmark person */}
          <linearGradient id="personGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A859" />
            <stop offset="100%" stopColor="#8DC63F" />
          </linearGradient>
          {/* Subtle drop shadow for premium depth */}
          <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#logoShadow)">
          {/* Crescent Moon Shape */}
          <path
            d="M 22 45 
               C 22 28, 38 18, 54 22 
               C 40 24, 32 35, 32 48 
               C 32 62, 42 72, 56 74 
               C 38 78, 22 66, 22 45 Z"
            fill="url(#crescentGradient)"
            transform="rotate(-15 50 50)"
          />

          {/* Checkmark Person Symbol */}
          {/* Head (Circle) */}
          <circle cx="53" cy="28" r="7" fill="url(#personGradient)" />
          {/* Body (Checkmark V-Shape) */}
          <path
            d="M 38 34 
               C 38 34, 43 38, 48 45 
               C 50 48, 52 52, 53 58 
               C 55 50, 60 40, 76 22 
               C 70 20, 56 36, 52 46 
               C 48 38, 43 34, 38 34 Z"
            fill="url(#personGradient)"
          />
        </g>
      </svg>

      {/* Logo Brand Text */}
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline font-sans text-xl md:text-2xl font-black tracking-tight">
            <span className="text-brand-navy">NOMAS</span>
            <span className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">FS</span>
            <span className="bg-gradient-to-r from-brand-green to-brand-lime bg-clip-text text-transparent">CU</span>
            <span className="text-brand-navy text-lg md:text-xl font-bold">.CL</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-500 -mt-1 block">
            GMEC Abogados
          </span>
        </div>
      )}
    </div>
  );
}
