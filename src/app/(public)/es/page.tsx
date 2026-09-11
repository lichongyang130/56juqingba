import Link from "next/link";
import { COMPONENTS } from "@/lib/data";

// #475 — the multilingual title test.
//
// Slugs stay English on purpose: /es is one translated landing page, not a
// parallel site, and inventing Spanish URLs for 261 untranslated pages would
// promise a translation that does not exist. What ships here is the part that
// can be honest today — a translated title/description and the two-way
// hreflang relationship between this page and the English home page, so a
// crawler can tell they are the same page in two languages.
const EN_TITLE = "Motif UI — Copy less. Ship more.";
const ES_TITLE = "Motif UI — copia menos, publica más";

export const metadata = {
  title: { absolute: ES_TITLE },
  description:
    "Copia menos, publica más: componentes originales, prompts probados y laboratorios de movimiento. Página de prueba para validar la ruta de internacionalización.",
  alternates: {
    canonical: "/es",
    languages: {
      en: "/",
      es: "/es",
      "x-default": "/",
    },
  },
  openGraph: {
    title: ES_TITLE,
    description: "Una página traducida, declarada como tal: los slugs siguen en inglés y sólo el título y el texto cambian.",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    // 519 — a page-level openGraph block replaces the layout's, images
    // included, so this page shipped with no share card at all. It points at
    // the site card rather than pretending to have one of its own.
    images: [{ url: "/og/default", width: 1200, height: 630, alt: "Motif UI — tarjeta del sitio" }],
  },
};

export const TRANSLATED_TITLE_TEST = { en: EN_TITLE, es: ES_TITLE };

const PILLARS = [
  {
    icon: "▦",
    title: "Biblioteca de componentes originales",
    body: "Elementos, animaciones, secciones y plantillas escritos en casa. Cada pieza trae su auditoría de calidad, accesibilidad y peso — y se copia con un clic, sin cuenta.",
    href: "/components",
    cta: "Explorar la biblioteca",
  },
  {
    icon: "◎",
    title: "Prompts probados de verdad",
    body: "Cada prompt se ejecuta en varios modelos antes de publicarse. Ves la puntuación de fidelidad, las capturas y los fallos — no un mockup bonito.",
    href: "/prompts",
    cta: "Ver los registros",
  },
  {
    icon: "∿",
    title: "Aprende sintiéndolo",
    body: "Laboratorios interactivos para curvas de easing, muelles y coreografía de scroll. Ajusta la física, mírala moverse y exporta el código listo para producción.",
    href: "/lab",
    cta: "Abrir el laboratorio",
  },
];

export default function EsLandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      {/* honest i18n test banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-panel px-4 py-3 text-xs">
        <p className="text-ink-dim">
          <span className="font-bold text-ink">Prueba de localización.</span> Una página traducida para validar la
          ruta de i18n antes de comprometernos con más idiomas. El resto del sitio sigue en inglés.
        </p>
        <Link href="/" className="font-semibold text-violet-300 hover:text-violet-200">English original →</Link>
      </div>

      {/* hero */}
      <div className="mx-auto mt-14 max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Motif UI · en español</p>
        <h1 className="mt-4 text-balance text-5xl font-black leading-[1.02] tracking-tight md:text-6xl">
          Copia menos.
          <br />
          <span className="text-gradient">Publica más.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-dim md:text-lg">
          Una plataforma abierta para la parte frontal de tu web: componentes animados originales, prompts de IA con
          puntuaciones reales de test, fondos vivos y laboratorios de movimiento.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/components" className="btn btn-primary px-7 py-3 text-base">Explorar la biblioteca</Link>
          <Link href="/lab" className="btn btn-ghost px-7 py-3 text-base">Probar el laboratorio — gratis</Link>
        </div>
      </div>

      {/* pillars */}
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="flex flex-col rounded-3xl border border-white/8 bg-panel p-6">
            <div className="text-2xl text-violet-300">{p.icon}</div>
            <h2 className="mt-3 text-lg font-extrabold tracking-tight">{p.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{p.body}</p>
            <Link href={p.href} className="mt-auto pt-4 text-xs font-bold text-violet-300 hover:text-violet-200">
              {p.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* numbers, translated labels only */}
      <div className="mt-14 rounded-3xl border border-white/8 bg-panel p-6 text-center md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Cifras honestas</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
          Mismo estándar editorial en cualquier idioma: solo contenido original, nada se publica sin sus tests,
          y cada plantilla dice cuánto tiempo real llevó construirla. Los números se consultan de los mismos datos
          que usa el sitio en inglés.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-faint">
          <Link href="/components" className="btn btn-ghost !px-4 !py-2">{COMPONENTS.length} componentes originales →</Link>
          <Link href="/prompts" className="btn btn-ghost !px-4 !py-2">74 prompts con registros →</Link>
          <Link href="/mission" className="btn btn-ghost !px-4 !py-2">Nuestra misión →</Link>
        </div>
      </div>
    </div>
  );
}
