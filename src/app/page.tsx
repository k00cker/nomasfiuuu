"use client";

import React, { useState, useEffect, useRef } from "react";
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
  AlertCircle,
  Landmark,
  TrendingUp,
  Search,
  Timer,
  ClipboardCheck,
  Clock,
  Users,
  AlertTriangle,
  Bell
} from "lucide-react";
import Logo from "@/components/Logo";

// Types
interface Article {
  id: number;
  slug: string;
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
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeArticle) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setActiveArticle(null);
          return;
        }

        if (e.key === "Tab" && modalRef.current) {
          const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const focusableElements = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
          );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Shift + Tab: if on the first element, wrap around to the last element
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            // Tab: if on the last element, wrap around to the first element
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";

      // Focus the first focusable element inside the modal
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const firstFocusable = modalRef.current.querySelector<HTMLElement>(focusableSelectors);
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";

        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [activeArticle]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkbox || rutError || emailError || !nombre || !rut || !email || !anio) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/06ac12285ff29de2a1687654c44d9cb5", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "Nombre Completo": nombre,
          "RUT": rut,
          "Correo Electrónico": email,
          "Año de Egreso / Retiro": anio,
          "_subject": `Nueva Solicitud de Evaluación Preliminar - ${nombre}`,
          "_replyto": email,
          "_captcha": "false"
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setNombre("");
        setRut("");
        setEmail("");
        setAnio("");
        setCheckbox(false);
      } else {
        alert("Ocurrió un error al enviar tu solicitud. Por favor, vuelve a intentarlo.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-rendered Blog Content for SEO & Jurisprudence Display
  const articles: Article[] = [
    {
      id: 1,
      slug: "retencion-tgr-fondo-solidario-mitos-verdades",
      title: "Retención de la Tesorería (TGR) por Fondo Solidario: Mitos y Verdades",
      excerpt: "La TGR retiene devoluciones de impuestos por deudas del FSCU, pero eso no significa que la deuda sea vigente ni que se hayan perdido defensas legales.",
      date: "15 de Junio, 2026",
      readTime: "4 min de lectura",
      category: "TGR e Impuestos",
      content: [
        "Cada año, muchas personas se dan cuenta que en la Operación Renta, su devolución de impuestos fue retenida por la Tesorería General de la República (TGR) debido a una deuda del Fondo Solidario de Crédito Universitario (FSCU). La reacción habitual es —además de la frustración del momento— pensar que la deuda se encuentra vigente y que ya no existe ninguna posibilidad de terminar con esta situación.",
        "La TGR actúa como un mecanismo de recuperación, reteniendo las devoluciones de impuestos sobre la base de la información proporcionada por las instituciones acreedoras del Fondo Solidario. Esa retención constituye un abono a la deuda, pero no convierte a la Tesorería en acreedora ni significa, por sí sola, que el deudor haya perdido las posibilidades de defenderse.",
        "Asimismo, la legislación no contempla la retención tributaria que realiza TGR como un acto de interrupción de la prescripción. En cambio, cada situación debe revisarse caso a caso.",
        "Por ello, la sola circunstancia de haber sufrido una retención de impuestos no permite concluir que la deuda sea inexigible ni, por el contrario, que la posibilidad de alegar prescripción se haya perdido."
      ]
    },
    {
      id: 2,
      slug: "vendieron-mi-deuda-fondo-solidario",
      title: "¿Vendieron mi deuda del Fondo Solidario? Lo que debes saber antes de asumir que todo está perdido",
      excerpt: "Las universidades pueden vender o ceder la administración de carteras de deudores a terceros. Eso no hace la deuda imprescriptible ni elimina las defensas.",
      date: "28 de Mayo, 2026",
      readTime: "5 min de lectura",
      category: "Administración",
      content: [
        "Muchos deudores del Fondo Solidario de Crédito Universitario se sorprenden al recibir llamados, correos electrónicos o notificaciones vía carta certificada de entidades distintas a la universidad en la que estudiaron. La primera reacción suele ser de desconcierto: \"¿Cómo es posible que otra institución me esté cobrando una deuda universitaria?\".",
        "La respuesta nace de la legislación del Fondo Solidario, la que contempla la posibilidad de que las instituciones de educación superior vendan total o parcialmente las carteras de deudores o celebren convenios para la administración y cobranza de los créditos. En otras palabras, la gestión de la deuda puede pasar a manos de terceros quienes se encargarán de realizar el cobro respectivo.",
        "Sin embargo, el hecho de que cambie el administrador o el titular del crédito no significa que la deuda se vuelva imprescriptible, que desaparezcan las defensas del deudor o que se creen nuevas obligaciones. El nuevo acreedor o administrador, en principio, adquiere la posición existente al momento de la cesión y debe sujetarse a las mismas limitaciones que afectaban al crédito.",
        "Por ello, recibir comunicaciones de una entidad distinta de la universidad no significa automáticamente que la deuda sea exigible ni que el deudor haya perdido la posibilidad de revisar su situación jurídica. Así, antes de pagar, reconocer la deuda o suscribir una reprogramación, resulta aconsejable conocer el estado real de la obligación, la fecha de exigibilidad de las cuotas, la existencia de pagarés y otros antecedentes relacionados."
      ]
    },
    {
      id: 3,
      slug: "hoy-cae-manana-fscu-reglas-pueden-cambiar",
      title: "Hoy es el CAE, mañana podría ser el FSCU: por qué las reglas del juego pueden volver a cambiar",
      excerpt: "El CAE y el FSCU son sistemas distintos regulados por leyes diferentes, pero la historia muestra que las reglas cambian y conviene estar preparado.",
      date: "12 de Mayo, 2026",
      readTime: "6 min de lectura",
      category: "Legislación",
      content: [
        "Durante años, el Crédito con Aval del Estado fue presentado como un sistema permanente de financiamiento de la educación superior. Sin embargo, hoy existe un proyecto de reforma que propone reemplazar el CAE mediante un nuevo sistema de Financiamiento para la Educación Superior (FES), incorporando además medidas que alcanzan al Fondo Solidario y otros créditos estudiantiles.",
        "Desde una perspectiva jurídica, no existe actualmente una ley que transforme automáticamente una deuda CAE en una deuda del Fondo Solidario, ni viceversa. Son sistemas distintos, regulados por leyes diferentes y con mecanismos de administración propios.",
        "No obstante, la historia del financiamiento universitario en Chile demuestra que las reglas cambian. El antiguo Crédito Fiscal Universitario dio paso al Fondo Solidario. Posteriormente surgió el CAE. Hoy se discute un nuevo sistema de financiamiento. Asimismo, los mecanismos de cobranza, la administración de las carteras, las facultades de retención y los procedimientos de reprogramación han sido modificados en diversas oportunidades por el legislador.",
        "Por ello, el verdadero riesgo no es que el CAE \"se transforme\" en Fondo Solidario. El riesgo consiste en asumir que las reglas actuales permanecerán inalterables.",
        "Las leyes cambian. Los mecanismos de cobro cambian. Los acreedores y administradores pueden cambiar. Y lo que hoy parece un problema exclusivo del CAE, mañana podría tener repercusiones directas o indirectas para los deudores del Fondo Solidario si el legislador vuelve a intervenir el sistema de financiamiento de la educación superior.",
        "Por esa razón, conocer hoy el estado de una deuda del FSCU, revisar su exigibilidad y evaluar oportunamente las defensas disponibles, puede resultar decisivo antes de que una nueva reforma altere nuevamente el escenario legal y normativo."
      ]
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
  
      // 1. ORGANIZACIÓN (Negocio legal — aumenta confianza E-E-A-T de Google)
      {
        '@type': 'LegalService',
        '@id': 'https://nomasfscu.cl/#organization',
        name: 'GMEC Abogados',
        alternateName: ['No Más FSCU', 'nomasfscu.cl', 'GMEC SpA'],
        url: 'https://nomasfscu.cl/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://nomasfscu.cl/img/gmecLOGO.jpeg',
        },
        description:
          'Estudio jurídico especializado en defensa de deudores del Fondo Solidario de Crédito Universitario (FSCU) en Chile. Servicios: prescripción de deudas, defensa ante demandas judiciales y liberación de retenciones TGR.',
        telephone: '+56963064291',
        email: 'contacto@gmecspa.cl',
        areaServed: {
          '@type': 'Country',
          name: 'Chile',
          sameAs: 'https://www.wikidata.org/wiki/Q298',
        },
        serviceType: [
          'Prescripción de Deudas FSCU',
          'Defensa ante Demandas Universitarias',
          'Liberación de Retención TGR',
          'Defensa Legal Deudores Chile',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicios GMEC Abogados',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'LegalService',
                name: 'Prescripción de Deudas FSCU',
                description:
                  'Evaluación del pagaré y demanda de prescripción civil para extinguir definitivamente la deuda del Fondo Solidario tras 5 años de inactividad de cobro judicial.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'LegalService',
                name: 'Defensa ante Demandas Judiciales FSCU',
                description:
                  'Interposición inmediata de defensas legales (excepciones), freno de embargos y resguardo del patrimonio ante notificaciones judiciales de cobro del Fondo Solidario.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'LegalService',
                name: 'Liberación Retención TGR',
                description:
                  'Análisis de la procedencia legal de la retención de devolución de impuestos (Operación Renta) por parte de la Tesorería General de la República y gestión judicial de su liberación.',
              },
            },
          ],
        },
        sameAs: [],
      },
  
      // 2. WEBSITE
      {
        '@type': 'WebSite',
        '@id': 'https://nomasfscu.cl/#website',
        url: 'https://nomasfscu.cl/',
        name: 'No Más FSCU — GMEC Abogados',
        description:
          'Plataforma de defensa legal especializada en deudas del Fondo Solidario de Crédito Universitario en Chile.',
        publisher: { '@id': 'https://nomasfscu.cl/#organization' },
        inLanguage: 'es-CL',
      },
  
      // 3. WEBPAGE PRINCIPAL
      {
        '@type': 'WebPage',
        '@id': 'https://nomasfscu.cl/#webpage',
        url: 'https://nomasfscu.cl/',
        name: 'No Más FSCU | Abogados Especialistas en Deuda Fondo Solidario Chile',
        description:
          'Evaluamos la prescripción de tu deuda del Fondo Solidario a los 5 años y te defendemos ante cobranzas judiciales en todo Chile de forma 100% remota.',
        isPartOf: { '@id': 'https://nomasfscu.cl/#website' },
        about: { '@id': 'https://nomasfscu.cl/#organization' },
        inLanguage: 'es-CL',
      },
  
      // 4. BLOG + ARTÍCULOS INDIVIDUALES
      // (Permite que Google indexe los artículos como resultados individuales)
      {
        '@type': 'Blog',
        '@id': 'https://nomasfscu.cl/#blog',
        name: 'Educación Legal — GMEC Abogados',
        description:
          'Artículos especializados sobre el Fondo Solidario de Crédito Universitario: jurisprudencia, prescripción, cobranzas y defensa legal para deudores en Chile.',
        url: 'https://nomasfscu.cl/#blog',
        publisher: { '@id': 'https://nomasfscu.cl/#organization' },
        inLanguage: 'es-CL',
        blogPost: [
          {
            '@type': 'BlogPosting',
            '@id': 'https://nomasfscu.cl/#article-tgr',
            headline: 'Retención de la Tesorería (TGR) por Fondo Solidario: Mitos y Verdades',
            description:
              'La TGR retiene devoluciones de impuestos por deudas del FSCU, pero eso no significa que la deuda sea vigente ni que se hayan perdido defensas legales.',
            datePublished: '2026-06-15',
            dateModified: '2026-06-15',
            url: 'https://nomasfscu.cl/#blog',
            author: { '@id': 'https://nomasfscu.cl/#organization' },
            publisher: { '@id': 'https://nomasfscu.cl/#organization' },
            keywords: ['retención TGR', 'devolución impuestos FSCU', 'Operación Renta', 'Fondo Solidario'],
            articleSection: 'TGR e Impuestos',
            about: {
              '@type': 'Thing',
              name: 'Retención TGR por deuda FSCU',
            },
            inLanguage: 'es-CL',
          },
          {
            '@type': 'BlogPosting',
            '@id': 'https://nomasfscu.cl/#article-cesion',
            headline: '¿Vendieron mi deuda del Fondo Solidario? Lo que debes saber antes de asumir que todo está perdido',
            description:
              'Las universidades pueden vender o ceder la administración de carteras de deudores a terceros. Eso no hace la deuda imprescriptible ni elimina las defensas.',
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            url: 'https://nomasfscu.cl/#blog',
            author: { '@id': 'https://nomasfscu.cl/#organization' },
            publisher: { '@id': 'https://nomasfscu.cl/#organization' },
            keywords: ['cesión deuda FSCU', 'cartera morosa fondo solidario', 'prescripción', 'defensa legal'],
            articleSection: 'Administración',
            about: {
              '@type': 'Thing',
              name: 'Cesión de cartera de deuda FSCU',
            },
            inLanguage: 'es-CL',
          },
          {
            '@type': 'BlogPosting',
            '@id': 'https://nomasfscu.cl/#article-cae',
            headline: 'Hoy es el CAE, mañana podría ser el FSCU: por qué las reglas del juego pueden volver a cambiar',
            description:
              'El CAE y el FSCU son sistemas distintos regulados por leyes diferentes, pero la historia muestra que las reglas cambian y conviene estar preparado.',
            datePublished: '2026-05-12',
            dateModified: '2026-05-12',
            url: 'https://nomasfscu.cl/#blog',
            author: { '@id': 'https://nomasfscu.cl/#organization' },
            publisher: { '@id': 'https://nomasfscu.cl/#organization' },
            keywords: ['CAE FSCU diferencias', 'reforma educacional Chile', 'legislación crédito universitario'],
            articleSection: 'Legislación',
            about: {
              '@type': 'Thing',
              name: 'Comparación CAE y FSCU en Chile',
            },
            inLanguage: 'es-CL',
          },
        ],
      },
  
      // 5. FAQ PAGE ── impacto visual alto: genera rich snippets en Google
      // Basado en las búsquedas reales más frecuentes detectadas en el mercado
      {
        '@type': 'FAQPage',
        '@id': 'https://nomasfscu.cl/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cuándo prescribe una deuda del Fondo Solidario (FSCU) en Chile?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Una deuda del Fondo Solidario de Crédito Universitario puede prescribir a los 5 años contados desde que la deuda fue exigible y no hubo cobro judicial activo. La prescripción no opera automáticamente: debe ser alegada ante el tribunal mediante una excepción de prescripción extintiva (Art. 2493 del Código Civil). La fecha exacta depende del pagaré y el historial de cobranza de cada caso.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué pasa si no pago el Fondo Solidario?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Si no pagas el FSCU, la universidad puede: (1) publicar tu nombre en la nómina de deudores morosos para que la TGR retenga tu devolución de impuestos, (2) iniciar cobranza prejudicial ofreciendo facilidades de pago, y (3) presentar una demanda ejecutiva civil usando el pagaré como título ejecutivo, lo que puede derivar en embargo. La deuda del FSCU no se reporta a DICOM. En cada etapa existen defensas legales disponibles.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Puede la TGR retener mi devolución de impuestos por una deuda del FSCU?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. Entre el 1 y 15 de febrero de cada año, las administraciones del FSCU publican la nómina de deudores morosos y la Tesorería General de la República (TGR) puede retener la devolución de la Operación Renta. Esta retención no implica que la deuda sea jurídicamente vigente ni que se hayan perdido defensas legales. Es posible gestionar judicialmente su liberación o anulación.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Si vendieron mi deuda del Fondo Solidario a un tercero puedo seguir defendiéndome?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. La cesión o venta de una cartera de deudores del FSCU a terceros no elimina las defensas legales disponibles ni hace la deuda imprescriptible. El nuevo acreedor asume la deuda en las mismas condiciones jurídicas en que se encontraba al momento de la cesión.',
            },
          },
          {
            '@type': 'Question',
            name: '¿El FSCU y el CAE son lo mismo?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Son sistemas completamente distintos. El FSCU (Ley N° 19.287) es administrado por cada universidad CRUCH, no tiene relación con DICOM y sus deudores aparecen en nóminas públicas. El CAE opera con garantía estatal y los bancos. Tienen reglas de cobranza, plazos y mecanismos de defensa distintos.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Atienden en regiones fuera de Santiago?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. GMEC Abogados opera 100% de forma remota con cobertura en todas las regiones de Chile. No es necesaria ninguna visita presencial.',
            },
          },
        ],
      },
  
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. SECCIÓN: INICIO (HERO SECTION) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-medium text-slate-600">
            <a href="#inicio" className="hover:text-brand-navy transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1">Inicio</a>
            <a href="#lo-que-hacemos" className="hover:text-brand-navy transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1">Lo que hacemos</a>
            <a href="#blog" className="hover:text-brand-navy transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1">Educación Legal</a>
            <a href="#contacto" className="hover:text-brand-navy transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1">Evaluación</a>
            <a
              href="https://wa.me/56963064291?text=Hola,%20necesito%20evaluar%20mi%20caso%20del%20Fondo%20Solidario."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-blue/20 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              Contacto
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none transition-colors"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg border-b border-slate-100 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1"
            >
              Inicio
            </a>
            <a
              href="#lo-que-hacemos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg border-b border-slate-100 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1"
            >
              Lo que hacemos
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg border-b border-slate-100 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1"
            >
              Educación Legal
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-brand-navy py-2 font-medium text-lg focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none rounded-md px-1"
            >
              Evaluación Gratuita
            </a>
            <a
              href="https://wa.me/56963064291?text=Hola,%20necesito%20evaluar%20mi%20caso%20del%20Fondo%20Solidario."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-base font-bold shadow-md focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none"
            >
              <MessageSquare className="w-5 h-5" />
              Contacto
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
                ¿Te siguen cobrando el FSCU?
              </h1>

              {/* Subheading */}
              <p className="text-lg text-slate-600 leading-relaxed mb-6 max-w-2xl">
                Muchas personas desconocen que sus obligaciones vinculadas al FSCU siguen generando intereses y pueden dar origen a cobranzas, retenciones tributarias y otras consecuencias financieras. Una revisión oportuna de tu situación puede ser determinante para conocer tus derechos y alternativas legales.
              </p>



              {/* Immediate conversion action */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href="https://wa.me/56963064291?text=Hola,%20necesito%20evaluar%20mi%20caso%20del%20Fondo%20Solidario."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-pulse-glow flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-brand-green to-brand-lime text-white text-base font-bold shadow-lg hover:shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-green/60 focus-visible:outline-none transition-all duration-300"
                >
                  <MessageSquare className="w-5 h-5 fill-white/10" />
                  Contacto vía WhatsApp
                </a>
                <a
                  href="#contacto"
                  className="flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-white border border-slate-300/80 text-brand-navy text-base font-bold hover:bg-slate-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none transition-all duration-300"
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
                  <div className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Gestión Remota, Evaluación personalizada</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-brand-navy">Confidencial</div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Secreto Profesional</div>
                </div>
              </div>
            </div>

            {/* Right Column (Hero Graphic representation of a court/shield) */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-sm mx-auto">
                {/* Floating circles / accents */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-blue/15 rounded-xl flex items-center justify-center text-brand-blue shadow-md z-10 animate-bounce">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-green/15 rounded-xl flex items-center justify-center text-brand-green shadow-md z-10 animate-pulse">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                {/* Main White Card */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full blur-xl pointer-events-none" />

                  <Logo iconOnly className="scale-[1.8] mb-6 mt-2" />

                  <h3 className="font-extrabold text-xl text-brand-navy mb-2 leading-snug">
                    Conoce el estado de tu deuda FSCU
                  </h3>
                  <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed mb-4">
                    recibe orientación especializada para decidir tus próximos pasos.
                  </p>

                  <ul className="text-left w-full space-y-2.5 my-4 text-xs font-bold text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Revisión individual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Atención en todo Chile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Orientación jurídica especializada</span>
                    </li>
                  </ul>

                  <div className="w-full py-2.5 px-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl text-amber-900 text-[10px] font-black tracking-wide uppercase my-4 shadow-sm flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Hoy es el CAE, mañana podría ser el FSCU.</span>
                  </div>

                  <div className="pt-2">
                    <Image
                      src="/img/gmecLOGO.jpeg"
                      alt="Logo GMEC Abogados"
                      width={140}
                      height={42}
                      className="rounded-lg opacity-95 hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN P3: ¿QUÉ PODRÍA ESTAR EN JUEGO? */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-blue text-xs md:text-sm font-bold uppercase tracking-wider block mb-2">

            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight">
              ¿Qué podría estar en juego?
            </h2>
            <div className="w-12 h-1 bg-brand-blue mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tarjeta 1 */}
            <div className="relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Landmark className="w-9 h-9 text-brand-navy" />
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-bold shadow-md">
                  $
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug">
                Retenciones de devolución de impuestos
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Las deudas del FSCU pueden generar retenciones de la Operación Renta y otras consecuencias patrimoniales que afectan tu planificación financiera.
              </p>
              <div className="w-full border-t border-slate-100 pt-5 mt-auto flex justify-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>

              {/* Flecha conectora (solo visible en desktop) */}
              <div className="hidden lg:block absolute top-16 -right-[26px] z-20">
                <svg className="w-12 h-6 text-slate-300" fill="none" viewBox="0 0 48 24">
                  <path d="M4 12h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M30 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Mail className="w-9 h-9 text-brand-navy" />
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center shadow-md">
                  <Bell className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug">
                Cobranzas y notificaciones
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Las gestiones de cobro pueden mantenerse activas durante años, generando incertidumbre y la necesidad de conocer tu situación jurídica real.
              </p>
              <div className="w-full border-t border-slate-100 pt-5 mt-auto flex justify-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>

              {/* Flecha conectora (solo visible en desktop) */}
              <div className="hidden lg:block absolute top-16 -right-[26px] z-20">
                <svg className="w-12 h-6 text-slate-300" fill="none" viewBox="0 0 48 24">
                  <path d="M4 12h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M30 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <TrendingUp className="w-9 h-9 text-brand-navy" />
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-bold shadow-md">
                  %
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug">
                Intereses y aumento de la deuda
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                El paso del tiempo no siempre juega a favor del deudor. En determinados casos, la deuda puede continuar generando intereses y costos asociados.
              </p>
              <div className="w-full border-t border-slate-100 pt-5 mt-auto flex justify-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>

              {/* Flecha conectora (solo visible en desktop) */}
              <div className="hidden lg:block absolute top-16 -right-[26px] z-20">
                <svg className="w-12 h-6 text-slate-300" fill="none" viewBox="0 0 48 24">
                  <path d="M4 12h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M30 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Tarjeta 4 */}
            <div className="relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
              <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Scale className="w-9 h-9 text-brand-navy" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug">
                Demandas y restricciones patrimoniales
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Dependiendo de las circunstancias de cada caso, pueden existir actuaciones judiciales que hagan recomendable revisar oportunamente los antecedentes.
              </p>
              <div className="w-full border-t border-slate-100 pt-5 mt-auto flex justify-center">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN P4: ¿POR QUÉ CONVIENE CONOCER TU SITUACIÓN? */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight">
              ¿Por qué conviene conocer tu situación?
            </h2>
            <div className="w-12 h-1 bg-brand-green mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/50 overflow-hidden">
            {/* Columna 1 */}
            <div className="flex flex-col items-center text-center p-8 lg:px-6">
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug min-h-[56px] flex items-center justify-center">
                Porque las reglas pueden cambiar
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                El financiamiento estudiantil en Chile ha sido objeto de múltiples reformas y futuras modificaciones legales pueden alterar nuevamente el escenario del FSCU.
              </p>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mt-auto">
                <Landmark className="w-5 h-5" />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col items-center text-center p-8 lg:px-6">
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                <Timer className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug min-h-[56px] flex items-center justify-center">
                Porque el tiempo puede ser determinante
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                La fecha de exigibilidad, los pagos, las cobranzas and las actuaciones judiciales pueden tener relevancia jurídica en la situación de cada persona.
              </p>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mt-auto">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Columna 3 */}
            <div className="flex flex-col items-center text-center p-8 lg:px-6">
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                <ClipboardCheck className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug min-h-[56px] flex items-center justify-center">
                Porque no todas las deudas están en la misma situación
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                Cada caso tiene una historia distinta. Dos personas con el mismo monto adeudado pueden encontrarse en escenarios jurídicos completamente diferentes.
              </p>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mt-auto">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Columna 4 */}
            <div className="flex flex-col items-center text-center p-8 lg:px-6">
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-navy mb-4 leading-snug min-h-[56px] flex items-center justify-center">
                Porque conocer tu situación permite tomar decisiones informadas
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                Antes de pagar, negociar o asumir que no existen alternativas, es importante comprender el estado jurídico real de tu caso.
              </p>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mt-auto">
                <Scale className="w-5 h-5" />
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
                  aria-haspopup="dialog"
                  className="inline-flex items-center gap-2 text-brand-cyan font-bold text-sm hover:text-brand-lime transition-all duration-200 cursor-pointer self-start group/btn focus-visible:ring-2 focus-visible:ring-brand-cyan/60 focus-visible:outline-none rounded-md px-1"
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
      <section id="contacto" className="py-20 md:py-28 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-100/50 order-2 lg:order-1">
              <h2 className="text-2xl font-extrabold text-brand-navy mb-4">
                Solicita una Evaluación Preliminar de tu Caso
              </h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Si tu caso puede esperar una revisión detallada de hasta 24 horas hábiles, completa el siguiente formulario oficial:
              </p>

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
                        aria-invalid={rutError ? "true" : "false"}
                        aria-describedby={rutError ? "rut-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-sm bg-white ${rutError
                            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                            : "border-slate-300/80 focus:ring-brand-blue/35 focus:border-brand-blue"
                          }`}
                      />
                      {rutError && (
                        <p id="rut-error" role="alert" className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
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
                        aria-invalid={emailError ? "true" : "false"}
                        aria-describedby={emailError ? "email-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all text-sm bg-white ${emailError
                            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                            : "border-slate-300/80 focus:ring-brand-blue/35 focus:border-brand-blue"
                          }`}
                      />
                      {emailError && (
                        <p id="email-error" role="alert" className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1 animate-fade-in">
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
                    className={`w-full py-4 rounded-2xl text-base font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:outline-none ${checkbox && !rutError && !emailError && nombre && rut && email && anio && !isSubmitting
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

            {/* Columna Derecha: Tarjeta visual informativa */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center order-1 lg:order-2 py-4">
              <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                {/* Accent Top-Left */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-blue/15 rounded-xl flex items-center justify-center text-brand-blue shadow-md z-10 animate-bounce">
                  <Scale className="w-6 h-6" />
                </div>
                {/* Accent Bottom-Right */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-green/15 rounded-xl flex items-center justify-center text-brand-green shadow-md z-10 animate-pulse">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                {/* Main White Card */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full blur-xl pointer-events-none" />

                  <Logo iconOnly className="scale-[1.8] mb-6 mt-2" />

                  <h3 className="font-extrabold text-xl text-brand-navy mb-2 leading-snug">
                    Conoce el estado de tu deuda FSCU
                  </h3>
                  <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed mb-4">
                    recibe orientación especializada para decidir tus próximos pasos.
                  </p>

                  <ul className="text-left w-full space-y-2.5 my-4 text-xs font-bold text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Revisión individual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Atención en todo Chile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Orientación jurídica especializada</span>
                    </li>
                  </ul>

                  <div className="w-full py-2.5 px-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl text-amber-900 text-[10px] font-black tracking-wide uppercase my-4 shadow-sm flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Hoy es el CAE, mañana podría ser el FSCU.</span>
                  </div>

                  <div className="pt-2">
                    <Image
                      src="/img/gmecLOGO.jpeg"
                      alt="Logo GMEC Abogados"
                      width={140}
                      height={42}
                      className="rounded-lg opacity-95 hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

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
                  href="mailto:contacto@gmecspa.cl"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-brand-cyan" />
                  contacto@gmecspa.cl
                </a>
                <a
                  href="tel:+56963064291"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-brand-cyan" />
                  +56 9 6306 4291
                </a>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-brand-cyan" />
                  Atención 100% remota con cobertura en todas las regiones de Chile
                </div>
                <div className="pt-2">
                  <Image
                    src="/img/gmecLOGO.jpeg"
                    alt="Logo GMEC Abogados"
                    width={180}
                    height={54}
                    className="rounded-xl opacity-95 hover:opacity-100 transition-all duration-300 shadow-md border border-slate-800"
                  />
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
            <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row md:justify-between items-center gap-4 text-[10px]">
              <p className="text-center md:text-left">
                &copy; {new Date().getFullYear()} GMEC Abogados. Todos los derechos reservados. Sitio diseñado para nomasfscu.cl.
              </p>
              <p className="text-center md:text-right text-slate-500 font-medium">
                Sitio desarrollado por{" "}
                <a
                  href="https://www.elquicode.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-hover"
                >
                  www.elquicode.cl
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* JURISPRUDENCE DETAIL MODAL / DRAWER (WOW Premium Feature) */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-brand-blue text-xs font-extrabold uppercase tracking-wider">
                  Jurisprudencia &bull; {activeArticle.category}
                </span>
                <h3 id="modal-title" className="text-xl md:text-2xl font-black text-brand-navy mt-1 leading-tight">
                  {activeArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors flex-shrink-0 ml-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
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
                    href={`https://wa.me/56963064291?text=Hola,%20leí%20su%20artículo%20sobre%20${encodeURIComponent(
                      activeArticle.title
                    )}%20y%20quiero%20evaluar%20mi%20caso.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-lime text-white text-xs md:text-sm font-bold shadow-md hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-green/60 focus-visible:outline-none"
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
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs md:text-sm font-bold hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
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
