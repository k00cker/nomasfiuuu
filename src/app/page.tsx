"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  ShieldCheck,
  Scale,
  FileText,
  Calendar,
  ArrowRight,
  Check,
  X,
  Menu,
  Phone,
  Mail,
  MapPin,
  Lock,
  Award,
  AlertCircle
} from "lucide-react";
import Logo from "@/components/Logo";

// Types
interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
}

export default function Home() {
  // Form State
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [anio, setAnio] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  
  // Validation States
  const [rutError, setRutError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Active Modal Article
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Chilean RUT Validation & Formatting
  const validateRut = (rutStr: string): boolean => {
    const clean = rutStr.replace(/[^0-9kK]/g, "");
    if (clean.length < 8) return false;
    
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toLowerCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = sum % 11;
    const calculatedDv = remainder === 0 ? "0" : remainder === 1 ? "k" : (11 - remainder).toString();
    
    return dv === calculatedDv;
  };

  const formatRut = (rutStr: string) => {
    // Remove all characters except digits and K/k
    const clean = rutStr.replace(/[^0-9kK]/g, "");
    if (clean.length <= 1) return clean;
    
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    
    let formattedBody = "";
    for (let i = body.length - 1, count = 0; i >= 0; i--, count++) {
      if (count > 0 && count % 3 === 0) {
        formattedBody = "." + formattedBody;
      }
      formattedBody = body[i] + formattedBody;
    }
    
    return `${formattedBody}-${dv}`.toUpperCase();
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
    
    if (formatted.length > 0) {
      if (!validateRut(formatted)) {
        setRutError("RUT inválido. Ingrese un RUT chileno válido (ej. 12.345.678-9).");
      } else {
        setRutError("");
      }
    } else {
      setRutError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length > 0 && !emailRegex.test(val)) {
      setEmailError("Ingrese un correo electrónico válido.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkbox || rutError || emailError || !nombre || !rut || !email || !anio) return;
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setNombre("");
      setRut("");
      setEmail("");
      setAnio("");
      setCheckbox(false);
    }, 1500);
  };

  // Pre-rendered Blog Content for SEO & Jurisprudence Display
  const articles: Article[] = [
    {
      id: 1,
      title: "¿Cuándo prescribe legalmente una deuda del FSCU? El plazo de los 5 años.",
      excerpt: "Conoce el fundamento legal que permite extinguir la cobranza del Fondo Solidario si la universidad no ha demandado judicialmente a tiempo.",
      date: "12 de Junio, 2026",
      readTime: "5 min de lectura",
      category: "Prescripción",
      content: [
        "El Fondo Solidario de Crédito Universitario (FSCU) es una de las deudas estudiantiles más comunes en Chile. Muchos exalumnos arrastran este saldo durante años bajo un estrés financiero constante. Sin embargo, la ley chilena establece plazos de caducidad para el cobro de estas obligaciones civiles.",
        "De acuerdo con las reglas generales de nuestro Código Civil (Artículo 2515) y la normativa aplicable a pagarés firmados para respaldar estas deudas, las acciones de cobro ordinario prescriben por el transcurso de 5 años contados desde que la obligación se hizo exigible.",
        "Esto significa que si la universidad o el administrador del fondo no ha interpuesto una demanda judicial de cobro válidamente notificada dentro del plazo de 5 años desde que venció la respectiva cuota o desde que se declaró la aceleración del saldo, el deudor tiene derecho a solicitar la Prescripción de la Deuda.",
        "Es muy importante recalcar que la prescripción no opera automáticamente. Debe ser declarada por los tribunales ordinarios de justicia mediante una demanda de prescripción (vía acción) o como una excepción legal dentro del juicio en caso de ser demandado. Una vez declarada por un juez, la deuda se extingue legalmente y se borra de los registros de morosidad, devolviendo la tranquilidad financiera al exalumno."
      ]
    },
    {
      id: 2,
      title: "Qué hacer si recibes una demanda de cobranza de tu universidad.",
      excerpt: "Si te notificaron judicialmente por deuda de Fondo Solidario, los plazos corren rápido. Conoce la estrategia clave para defender tu patrimonio.",
      date: "28 de Mayo, 2026",
      readTime: "6 min de lectura",
      category: "Defensa Judicial",
      content: [
        "Recibir la visita de un receptor judicial notificando una demanda por cobro del Fondo Solidario puede ser una experiencia sumamente estresante. No obstante, el peor error en esta instancia es no hacer nada. El silencio en el proceso judicial equivale a aceptar la ejecución del embargo y posterior remate de bienes.",
        "Una vez notificada la demanda, el deudor cuenta con un plazo legal estricto de solo 8 días hábiles (u 4 días, según las circunstancias del juicio ejecutivo) para presentar formalmente sus excepciones o defensas legales a través del patrocinio de un abogado habilitado.",
        "La defensa especializada consiste en analizar el expediente para determinar si se han cumplido los requisitos formales de la notificación, verificar si las firmas o pagarés están debidamente autenticados, y de manera crucial, alegar la Prescripción de la Deuda si ya transcurrieron los plazos de 5 años sin cobro.",
        "En GMEC Abogados implementamos defensas estructuradas que paralizan el proceso ejecutivo de cobro, protegen tu domicilio y pertenencias de un eventual embargo, y buscan archivar definitivamente la causa por vencimiento de los plazos de cobro judicial."
      ]
    },
    {
      id: 3,
      title: "Retención de la Tesorería (TGR) por Fondo Solidario: Mitos y verdades.",
      excerpt: "Descubre cómo recuperar la devolución de impuestos retenida anualmente por la Tesorería General de la República de forma legal.",
      date: "15 de Mayo, 2026",
      readTime: "4 min de lectura",
      category: "TGR e Impuestos",
      content: [
        "Cada año en época de Operación Renta, miles de profesionales e independientes ven frustrada su devolución de impuestos debido a la retención automática efectuada por la Tesorería General de la República (TGR) para saldar deudas pendientes de créditos universitarios.",
        "Es un mito que esta retención sea permanente e intocable. La TGR actúa en base a los listados de morosos entregados por las respectivas universidades. Si esa deuda cumple con los plazos legales para declararse prescrita (más de 5 años de inactividad de cobro legal), la retención del impuesto carece de sustento permanente y puede ser desafiada.",
        "Para detener de raíz esta retención de cara a los siguientes años, el camino legal es demandar judicialmente a la universidad para que se declare la prescripción de los pagarés asociados. Una vez que se cuenta con la sentencia judicial ejecutoriada de prescripción, se oficia a la universidad y a la TGR para que eliminen la deuda del sistema de retenciones.",
        "En GMEC Abogados te acompañamos en este proceso para liberar tu flujo de caja de la devolución de impuestos anual y recuperar tus fondos injustamente retenidos."
      ]
    }
  ];

  return (
    <>
      {/* 1. SECCIÓN: INICIO (HERO SECTION) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-medium text-slate-600">
            <a href="#inicio" className="hover:text-brand-navy transition-colors duration-200">Inicio</a>
            <a href="#lo-que-hacemos" className="hover:text-brand-navy transition-colors duration-200">Lo que hacemos</a>
            <a href="#blog" className="hover:text-brand-navy transition-colors duration-200">Educación Legal</a>
            <a href="#contacto" className="hover:text-brand-navy transition-colors duration-200">Evaluación</a>
            <a
              href="https://wa.me/569XXXXXXXX?text=Hola,%20necesito%20evaluar%20urgente%20mi%20caso%20del%20Fondo%20Solidario."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-blue/20 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              Contacto Urgente
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-6 flex flex-col gap-4 animate-fade-in">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg border-b border-slate-100"
            >
              Inicio
            </a>
            <a
              href="#lo-que-hacemos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg border-b border-slate-100"
            >
              Lo que hacemos
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg border-b border-slate-100"
            >
              Educación Legal
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg"
            >
              Evaluación Gratuita
            </a>
            <a
              href="https://wa.me/569XXXXXXXX?text=Hola,%20necesito%20evaluar%20urgente%20mi%20caso%20del%20Fondo%20Solidario."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-base font-bold shadow-md"
            >
              <MessageSquare className="w-5 h-5" />
              Contacto Urgente vía WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* Hero Content Section */}
      <section id="inicio" className="relative overflow-hidden bg-slate-50 py-16 md:py-24 lg:py-32">
        {/* Visual background accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Authority Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/70 border border-slate-300/60 text-slate-800 text-xs md:text-sm font-semibold tracking-wide mb-6">
                <Award className="w-4 h-4 text-brand-navy" />
                <span>Servicio de Cobertura Nacional — GMEC Abogados</span>
              </div>

              {/* Headline H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy leading-tight tracking-tight mb-6">
                ¿Te siguen cobrando el FSCU?{" "}
                <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-green bg-clip-text text-transparent">
                  Protegemos tu patrimonio
                </span>{" "}
                con defensa legal especializada.
              </h1>

              {/* Subheading */}
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
                Evaluamos la prescripción de tu deuda a los 5 años y te defendemos ante cobranzas judiciales en todo Chile de forma remota. Recupera la tranquilidad que mereces.
              </p>

              {/* Immediate conversion action */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href="https://wa.me/569XXXXXXXX?text=Hola,%20necesito%20evaluar%20urgente%20mi%20caso%20del%20Fondo%20Solidario."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-pulse-glow flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-brand-green to-brand-lime text-white text-base font-bold shadow-lg hover:shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <MessageSquare className="w-5 h-5 fill-white/10" />
                  Contacto Urgente vía WhatsApp
                </a>
                <a
                  href="#contacto"
                  className="flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-white border border-slate-300/80 text-brand-navy text-base font-bold hover:bg-slate-100 active:scale-[0.98] transition-all duration-300"
                >
                  Evaluación Preliminar
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Quality markers */}
              <div className="grid grid-cols-3 gap-6 md:gap-10 mt-12 border-t border-slate-200 pt-8 w-full">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-brand-navy">5+ Años</div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Plazo de Prescripción</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-brand-navy">100%</div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Gestión Remota Chile</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-brand-navy">Confidencial</div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Secreto Profesional</div>
                </div>
              </div>
            </div>

            {/* Right Column (Hero Graphic representation of a court/shield) */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center bg-white rounded-3xl shadow-2xl border border-slate-100">
                {/* Floating circles / accents */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-brand-cyan/20 rounded-2xl flex items-center justify-center text-brand-navy font-bold shadow-md animate-bounce">
                  <Scale className="w-8 h-8 text-brand-blue" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-brand-green/20 rounded-2xl flex items-center justify-center text-brand-navy font-bold shadow-md animate-pulse">
                  <ShieldCheck className="w-8 h-8 text-brand-green" />
                </div>

                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Logo iconOnly className="scale-[2.5] mb-12" />
                  <h3 className="font-extrabold text-xl text-brand-navy mb-2">Defensa Judicial</h3>
                  <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                    Protección patrimonial integral frente a demandas del Fondo Solidario y embargos.
                  </p>
                  <div className="mt-6 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    Firma GMEC Abogados
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN: LO QUE HACEMOS (SERVICIOS Y ENFOQUE) */}
      <section id="lo-que-hacemos" className="py-20 md:py-28 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
              Nuestra Especialidad: Tu tranquilidad frente al Fondo Solidario
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Analizamos de forma exhaustiva tu situación jurídica para encontrar la mejor salida legal al cobro de deudas universitarias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Prescripción */}
            <div className="flex flex-col bg-slate-50 border border-slate-200/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-100">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-6">
                <Scale className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Prescripción de Deudas</h3>
              <p className="text-slate-600 leading-relaxed text-sm flex-1">
                La ley chilena faculta la extinción de deudas si transcurren 5 años de inactividad de cobro judicial formal. Evaluamos tu pagaré y demandamos la prescripción civil para eliminar la deuda de tu historial definitivamente.
              </p>
            </div>

            {/* Card 2: Defensa */}
            <div className="flex flex-col bg-slate-50 border border-slate-200/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-100">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Defensa ante Demandas</h3>
              <p className="text-slate-600 leading-relaxed text-sm flex-1">
                Si ya recibiste una notificación judicial de cobro, actuamos de forma inmediata. Contamos con plazos muy estrictos en Chile para interponer defensas legales (excepciones), frenar el embargo de bienes y resguardar tu casa.
              </p>
            </div>

            {/* Card 3: Retención de Impuestos */}
            <div className="flex flex-col bg-slate-50 border border-slate-200/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-100">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Retención de Impuestos</h3>
              <p className="text-slate-600 leading-relaxed text-sm flex-1">
                Anualmente la Tesorería General de la República retiene la devolución de renta de deudores del Fondo Solidario. Analizamos la procedencia legal de dicha retención y gestionamos judicialmente su liberación o anulación.
              </p>
            </div>
          </div>

          {/* Validation Block */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-4 px-6 py-5 rounded-2xl bg-slate-50 border border-slate-200/70 max-w-4xl mx-auto">
            <Lock className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-slate-700 text-center md:text-left">
              Casos analizados con absoluto secreto profesional y apego a la normativa del Colegio de Abogados de Chile.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: BLOG (EDUCACIÓN Y AUTORIDAD) */}
      <section id="blog" className="py-20 md:py-28 bg-brand-navy text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-brand-cyan text-xs md:text-sm font-bold uppercase tracking-wider block mb-2">
                Conocimiento y Jurisprudencia
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Artículos destacados e información clave
              </h2>
            </div>
            <p className="text-slate-300 mt-4 md:mt-0 max-w-md text-sm leading-relaxed">
              Mantente informado con explicaciones claras redactadas por nuestros abogados especialistas sobre la defensa del deudor de educación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col bg-brand-navy-dark border border-slate-700/80 p-8 rounded-2xl transition-all duration-300 hover:border-slate-500 hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-brand-cyan">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-brand-cyan transition-colors duration-200">
                  {article.title}
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-2 text-brand-cyan font-bold text-sm hover:text-brand-lime transition-all duration-200 cursor-pointer self-start group/btn"
                >
                  Leer artículo de jurisprudencia
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: CONTACTO (EMBUDO DE EVALUACIÓN PRELIMINAR) */}
      <section id="contacto" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
              Solicita una Evaluación Preliminar de tu Caso
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Si tu caso puede esperar una revisión detallada de hasta 24 horas hábiles, completa el siguiente formulario oficial:
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-100">
            {isSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green mb-6 scale-110">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">¡Formulario Recibido Exitosamente!</h3>
                <p className="text-slate-600 max-w-md mx-auto leading-relaxed text-sm">
                  Un abogado especialista de **GMEC Abogados** evaluará tu situación legal con absoluta confidencialidad y se contactará contigo en un plazo máximo de 24 horas hábiles.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-sm"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre Completo */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-bold text-slate-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Juan Pérez González"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300/80 focus:ring-2 focus:ring-brand-blue/35 focus:border-brand-blue outline-none transition-all text-sm bg-white"
                    />
                  </div>

                  {/* RUT */}
                  <div>
                    <label htmlFor="rut" className="block text-sm font-bold text-slate-700 mb-2">
                      RUT *
                    </label>
                    <input
                      type="text"
                      id="rut"
                      required
                      value={rut}
                      onChange={handleRutChange}
                      placeholder="Ej. 12.345.678-9"
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-sm bg-white ${
                        rutError
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-slate-300/80 focus:ring-brand-blue/35 focus:border-brand-blue"
                      }`}
                    />
                    {rutError && (
                      <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {rutError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Correo Electrónico */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="correo@ejemplo.cl"
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-sm bg-white ${
                        emailError
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-slate-300/80 focus:ring-brand-blue/35 focus:border-brand-blue"
                      }`}
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Año de Egreso / Retiro */}
                  <div>
                    <label htmlFor="anio" className="block text-sm font-bold text-slate-700 mb-2">
                      Año Egreso / Retiro de la Universidad *
                    </label>
                    <select
                      id="anio"
                      required
                      value={anio}
                      onChange={(e) => setAnio(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300/80 focus:ring-2 focus:ring-brand-blue/35 focus:border-brand-blue outline-none transition-all text-sm bg-white"
                    >
                      <option value="">Selecciona una opción</option>
                      {Array.from({ length: 47 }, (_, i) => 2026 - i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkbox obligatorios */}
                <div className="flex gap-3 items-start border-t border-slate-200 pt-6 mt-6">
                  <input
                    type="checkbox"
                    id="consentimiento"
                    required
                    checked={checkbox}
                    onChange={(e) => setCheckbox(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-brand-navy focus:ring-brand-blue/40 mt-1 cursor-pointer"
                  />
                  <label htmlFor="consentimiento" className="text-xs text-slate-500 leading-relaxed select-none cursor-pointer">
                    Declaro que la información proporcionada es veraz y autorizo a GMEC Abogados a tratar mis datos personales para efectos de la evaluación preliminar de mi situación jurídica y para contactarme en relación con esta consulta. Asimismo, entiendo que el envío de este formulario no constituye contratación de servicios profesionales ni genera una relación abogado-cliente.
                  </label>
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={!checkbox || !!rutError || !!emailError || !nombre || !rut || !email || !anio || isSubmitting}
                  className={`w-full py-4 rounded-2xl text-base font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    checkbox && !rutError && !emailError && nombre && rut && email && anio && !isSubmitting
                      ? "bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-green text-white hover:opacity-95 hover:scale-[1.01] cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-brand-navy rounded-full animate-spin" />
                      Procesando Solicitud...
                    </>
                  ) : (
                    "Enviar Formulario de Evaluación"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER (PIE DE PÁGINA INSTITUCIONAL) */}
      <footer className="bg-brand-navy-dark text-slate-300 border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-800">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 flex flex-col items-start gap-4">
              <Logo />
              <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
                Estudio jurídico enfocado en proveer soluciones definitivas para deudores del Fondo Solidario a nivel nacional de manera transparente, confidencial y oportuna.
              </p>
            </div>

            {/* Column 2: Contact Info */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Contacto & Soporte
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="mailto:contacto@gmecabogados.cl"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-brand-cyan" />
                  contacto@gmecabogados.cl
                </a>
                <a
                  href="tel:+562XXXXXXXX"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-brand-cyan" />
                  +56 2 2XXX XXXX
                </a>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-brand-cyan" />
                  Atención 100% remota con cobertura en todas las regiones de Chile
                </div>
              </div>
            </div>

            {/* Column 3: Links */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#inicio" className="hover:text-white transition-colors duration-200">Inicio</a>
                </li>
                <li>
                  <a href="#lo-que-hacemos" className="hover:text-white transition-colors duration-200">Servicios</a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-white transition-colors duration-200">Educación Legal</a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-white transition-colors duration-200">Evaluación Preliminar</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-12 text-xs text-slate-500 space-y-4 max-w-5xl">
            <p className="leading-relaxed">
              <span className="font-extrabold text-slate-400 block mb-1">Aviso Legal Destacado (Disclaimer):</span>
              El uso de esta plataforma y el envío de formularios web regulan una solicitud informativa preliminar y no configuran un mandato judicial ni contrato de prestación de servicios hasta la firma del documento correspondiente.
            </p>
            <p className="border-t border-slate-800/60 pt-6 text-center text-[10px]">
              &copy; {new Date().getFullYear()} GMEC Abogados. Todos los derechos reservados. Sitio diseñado para nomasfscu.cl.
            </p>
          </div>
        </div>
      </footer>

      {/* JURISPRUDENCE DETAIL MODAL / DRAWER (WOW Premium Feature) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-brand-blue text-xs font-extrabold uppercase tracking-wider">
                  Jurisprudencia &bull; {activeArticle.category}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-brand-navy mt-1 leading-tight">
                  {activeArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors flex-shrink-0 ml-4 cursor-pointer"
                aria-label="Cerrar artículo"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-slate-700 leading-relaxed text-sm md:text-base">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Publicado el {activeArticle.date}</span>
                <span>&bull;</span>
                <span>{activeArticle.readTime}</span>
              </div>
              
              {activeArticle.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 mt-8 space-y-4">
                <h4 className="font-extrabold text-brand-navy flex items-center gap-2 text-sm md:text-base">
                  <ShieldCheck className="w-5 h-5 text-brand-green" />
                  ¿Te encuentras en una situación similar?
                </h4>
                <p className="text-xs md:text-sm text-slate-600">
                  No dejes pasar el tiempo. Los plazos en defensa del Fondo Solidario corren rápidamente y actuar a tiempo puede marcar la diferencia entre conservar tus bienes o enfrentar un embargo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={`https://wa.me/569XXXXXXXX?text=Hola,%20leí%20su%20artículo%20sobre%20${encodeURIComponent(
                      activeArticle.title
                    )}%20y%20quiero%20evaluar%20mi%20caso.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-lime text-white text-xs md:text-sm font-bold shadow-md hover:opacity-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Consultar por WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setActiveArticle(null);
                      // Scroll to contact form
                      const contactSec = document.getElementById("contacto");
                      if (contactSec) {
                        contactSec.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs md:text-sm font-bold hover:bg-slate-100"
                  >
                    Ir al Formulario de Evaluación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
