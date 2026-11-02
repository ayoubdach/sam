import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Plus,
  Sparkles,
  MessageCircle,
  Info,
  Brush,
  ShieldCheck,
  Gem,
  ChevronDown,
} from "lucide-react";
import { useCatalog, getPrice, frameStyleFor } from "../data/CatalogContext";
import { useCart } from "../context/CartContext";
import { Reveal } from "../hooks/useReveal";
import { flyToCart } from "../utils/flyToCart";
import { formatTND } from "../config";

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Hero({ ready }) {
  const rise = (delay) => ({
    className: ready ? "animate-rise" : "opacity-0",
    style: { animationDelay: `${delay}ms` },
  });

  /* promises spotlight: one promise lit at a time, rotating while the hero is on screen */
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const promisesRef = useRef(null);

  useEffect(() => {
    const el = promisesRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || paused || !inView) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % VALUES.length), 3400);
    return () => clearInterval(t);
  }, [ready, paused, inView, active]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-obsidian pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 sm:pb-20 sm:pt-36 lg:justify-center lg:pb-28"
    >
      {/* background video (muted loop; poster shows if autoplay is blocked or motion is reduced) */}
      <div className="absolute inset-0 -z-10">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-poster.jpg`}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[35%_50%] lg:object-center"
        />
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover object-[35%_50%] lg:object-center"
          src={`${import.meta.env.BASE_URL}images/hero-loop.mp4`}
          poster={`${import.meta.env.BASE_URL}images/hero-poster.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden
          tabIndex={-1}
        />
        {/* legibility: even tint + stronger fall-off where the text sits */}
        <div className="absolute inset-0 bg-obsidian/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent lg:bg-gradient-to-r lg:from-obsidian/85 lg:via-obsidian/45 lg:to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 sm:block sm:flex-none sm:px-8">
        {/* TEXT */}
        <div className="mx-auto flex flex-1 flex-col justify-end gap-5 [@media(max-height:720px)]:gap-4 text-center sm:block lg:max-w-6xl">
          <h1 className={`${ready ? "brush-on" : ""} mt-4 font-display text-left sm:text-center sm:mt-0 text-[clamp(2.4rem,11.6vw,3.3rem)] [@media(max-height:720px)]:text-[2.1rem] font-medium leading-[1.02] tracking-[-0.015em] text-cream [filter:drop-shadow(0_2px_18px_rgba(43,29,22,0.4))] sm:text-[5rem] lg:text-[5.8rem] xl:text-[6.8rem]`}>
            <span className="block overflow-hidden pb-1.5">
              <span className="block paint-reveal" style={{ "--d": "250ms" }}>
                Donnez du caractère
              </span>
            </span>
            <span className="block overflow-hidden pb-4">
              <span className="block paint-reveal" style={{ "--d": "650ms" }}>
                <em className="gold-sweep pr-2 font-normal italic">à votre décoration.</em>
                <svg className="brush-stroke" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <linearGradient id="brush-grad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor="#d8924f" stopOpacity="0.15" />
                      <stop offset="0.25" stopColor="#ecc99c" />
                      <stop offset="0.7" stopColor="#d8924f" />
                      <stop offset="1" stopColor="#d8924f" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>
                  <path d="M3 11 C 55 4, 110 13, 165 8 S 255 5, 297 9" pathLength="1" fill="none" stroke="url(#brush-grad)" strokeWidth="5" strokeLinecap="round" />
                  <path d="M40 14 C 100 10, 170 15, 240 11" pathLength="1" fill="none" stroke="url(#brush-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </svg>
              </span>
            </span>
          </h1>

          <div {...rise(700)} className={`mx-auto mt-5 w-full max-w-3xl sm:mt-8 ${rise(700).className}`}>
            <ul
              ref={promisesRef}
              style={{ "--act": active }}
              onPointerLeave={() => setPaused(false)}
              className={`value-panel gold-frame relative overflow-hidden rounded-2xl bg-gradient-to-br from-obsidian/50 via-obsidian/30 to-obsidian/45 backdrop-blur-md divide-y divide-cream/10 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${ready ? "value-on" : ""}`}
            >
              <span aria-hidden className="value-line absolute left-0 top-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-amber-glow to-transparent" />
              <span aria-hidden className="value-sheen" />
              {VALUES.map(({ Icon, pre, em, post }, i) => (
                <li
                  key={em}
                  data-i={i}
                  data-active={active === i}
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") {
                      setActive(i);
                      setPaused(true);
                    }
                  }}
                  style={{ "--i": i }}
                  className="group relative isolate flex items-center gap-3.5 px-4 py-2 [@media(max-height:720px)]:py-1 transition-colors duration-500 hover:bg-cream/[0.05] active:bg-cream/[0.08] text-left sm:flex-col sm:items-center sm:gap-4 sm:px-6 sm:pb-6 sm:pt-5 sm:text-center"
                >
                  <span aria-hidden className="promise-wash" />
                  <span className="gold-ring promise-icon grid h-9 w-9 [@media(max-height:720px)]:h-8 [@media(max-height:720px)]:w-8 shrink-0 place-items-center rounded-full bg-obsidian/40 text-amber-glow transition duration-500 group-hover:scale-110 group-hover:bg-amber-glow group-hover:text-obsidian sm:h-11 sm:w-11">
                    <Icon size={18} strokeWidth={1.4} />
                  </span>
                  <span className="promise-text pr-3 font-display text-[1.2rem] [@media(max-height:720px)]:text-[1.05rem] leading-[1.15] tracking-[0.005em] text-cream sm:pr-0 sm:text-[1.45rem]">
                    {pre}
                    <em className="text-gold-glow pr-0.5 font-normal italic">{em}</em>
                    {post}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div {...rise(900)} className={`mt-5 flex flex-col items-stretch gap-2.5 sm:justify-center sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 ${rise(900).className}`}>
            <button
              onClick={() => scrollToId("gallery")}
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-terracotta px-6 py-3 text-[11px] min-[380px]:text-xs min-[380px]:px-8 font-bold uppercase tracking-[0.14em] min-[380px]:tracking-[0.16em] text-cream sm:py-4 sm:text-sm sm:tracking-[0.18em] shadow-xl shadow-obsidian/30 transition active:scale-[0.98] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-sienna transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative">Explorer la Galerie</span>
              <ArrowDownRight size={18} className="relative transition group-hover:translate-y-0.5" />
            </button>
            <button
              onClick={() => scrollToId("contact")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream/40 bg-obsidian/30 px-5 py-3 text-[11px] min-[380px]:text-xs font-bold uppercase tracking-[0.1em] min-[380px]:tracking-[0.14em] sm:px-7 sm:py-4 sm:text-sm sm:tracking-[0.18em] text-cream backdrop-blur-sm transition active:scale-[0.98] hover:border-cream hover:bg-cream hover:text-obsidian sm:w-auto"
            >
              Personnaliser votre tableau
              <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cream/60 lg:flex">
        Scroll
        <span className="relative h-8 w-5 rounded-full border border-cream/40">
          <span className="animate-scroll-dot absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-glow" />
        </span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  MARQUEE                                                            */
/* ------------------------------------------------------------------ */

export function Marquee({ reverse = false, dark = true }) {
  const words = ["Peinture", "Poterie", "Couture", "Tissage", "Dorure à la feuille", "Fait main", "Tunis", "Cuir", "Calligraphie"];
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w + i} className="flex items-center">
          <span
            className={`px-8 font-display text-5xl italic sm:text-6xl ${
              i % 2 ? "text-outline" : ""
            }`}
          >
            {w}
          </span>
          <Sparkles size={26} className="text-amber-glow" />
        </span>
      ))}
    </div>
  );
  return (
    <div
      className={`relative overflow-hidden py-6 ${
        dark ? "bg-obsidian text-gold" : "bg-terracotta text-cream"
      }`}
      aria-hidden
    >
      <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row}
        {row}
      </div>
    </div>
  );
}

/* Gold sparkles that twinkle over the painting while the effect is on */
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  x: ((i * 37 + 13) % 90) + 5,
  y: ((i * 53 + 7) % 72) + 8,
  d: ((i * 0.27) % 2).toFixed(2),
  s: 3 + (i % 3),
}));

/* The three core promises shown in the hero */
const VALUES = [
  { Icon: Brush, pre: "Peintures réalisées à la ", em: "main", post: "" },
  { Icon: ShieldCheck, pre: "Aucune ", em: "impression", post: " sur toile" },
  { Icon: Gem, pre: "Créations ", em: "personnalisées", post: "" },
];

/* ------------------------------------------------------------------ */
/*  PRODUCT CARD                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({ product, index }) {
  const { addToCart, openCart } = useCart();
  const sizes = product.sizes.length
    ? product.sizes
    : [{ id: "std", label: "Standard", price_modifier: 0 }];
  const [size, setSize] = useState(sizes[0].id);
  const [frame, setFrame] = useState("none");
  const [added, setAdded] = useState(false);
  const imgRef = useRef(null);
  const timer = useRef(0);

  const [fx, setFx] = useState(false); // "hung on the wall" hover / touch effect
  const fxTimer = useRef(0);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(fxTimer.current);
    },
    []
  );

  const resetTilt = (el) => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  const fxOn = () => {
    clearTimeout(fxTimer.current);
    setFx(true);
  };
  const fxOff = (el) => {
    clearTimeout(fxTimer.current);
    setFx(false);
    if (el) resetTilt(el);
  };
  const fxMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
  };

  const sizeObj = sizes.find((s) => s.id === size) || sizes[0];
  // "Sans cadre" is always offered; other frames only if a price exists for the chosen size
  const frameOptions = [
    { id: "none", label: "Sans cadre", cost: 0 },
    ...product.frames
      .map((f) => ({ id: f.id, label: f.label, cost: product.framePrice(sizeObj.id, f.id) }))
      .filter((f) => f.cost !== null),
  ];
  const frameObj = frameOptions.find((f) => f.id === frame) || frameOptions[0];
  const price = getPrice(product, sizeObj.id, frameObj.id);

  const handleAdd = () => {
    flyToCart(imgRef.current);
    addToCart({
      id: product.id,
      reference: product.reference,
      name: product.name,
      image: product.image,
      size: sizeObj.id,
      frame: frameObj.id,
      sizeLabel: sizeObj.label,
      frameLabel: frameObj.label,
      unitPrice: price,
    });
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Reveal
      delay={(index % 3) * 120}
      className={`min-w-0 ${index % 3 === 1 ? "lg:mt-16" : index % 3 === 2 ? "lg:mt-6" : ""}`}
    >
      <article className="group relative flex h-full min-w-0 flex-col rounded-[1.75rem] bg-paper p-3 shadow-[0_1px_0_rgba(43,29,22,0.04),0_20px_50px_-20px_rgba(90,50,20,0.25)] ring-1 ring-sand transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-20px_rgba(180,83,42,0.45)] hover:ring-gold/60">
        {/* IMAGE */}
        <div
          className={`art-stage relative aspect-square overflow-hidden rounded-[1.25rem] sm:aspect-[4/5] ${fx ? "is-fx" : ""}`}
          onPointerEnter={fxOn}
          onPointerDown={fxOn}
          onPointerMove={fxMove}
          onPointerLeave={(e) => e.pointerType !== "touch" && fxOff(e.currentTarget)}
          onPointerUp={(e) => {
            if (e.pointerType !== "touch") return;
            const el = e.currentTarget;
            clearTimeout(fxTimer.current);
            fxTimer.current = setTimeout(() => fxOff(el), 2600);
          }}
          onPointerCancel={(e) => fxOff(e.currentTarget)}
        >
          <div className="art-canvas absolute inset-0 overflow-hidden">
            <img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              loading="lazy"
              draggable={false}
              className="h-full w-full select-none object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-60" />
            <span className="art-shine" aria-hidden />
            {SPARKS.map((sp, i) => (
              <span
                key={i}
                aria-hidden
                className="art-spark"
                style={{ left: `${sp.x}%`, top: `${sp.y}%`, width: sp.s, height: sp.s, "--d": `${sp.d}s` }}
              />
            ))}
          </div>

          {/* index number */}
          <span className="pointer-events-none absolute bottom-2 left-4 font-display text-7xl font-light italic leading-none text-white/80 mix-blend-overlay">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* tag */}
          <span className="absolute right-3 top-3 rounded-full bg-obsidian/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold backdrop-blur">
            {product.tag}
          </span>

          {/* price badge */}
          <div className="absolute left-3 top-3 overflow-hidden rounded-full bg-cream/95 px-4 py-2 shadow-lg backdrop-blur transition group-hover:bg-amber-glow">
            <span
              key={price}
              className="block animate-[rise_0.5s_ease_both] font-display text-xl font-bold leading-none text-obsidian tabular-nums"
            >
              {price.toLocaleString("fr-TN")}
              <span className="ml-1 font-sans text-[10px] font-extrabold tracking-wider">TND</span>
            </span>
          </div>
        </div>

        {/* INFO */}
        <div className="flex min-w-0 flex-1 flex-col px-2 pb-1 pt-3 sm:pb-2 sm:pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 font-display text-xl font-semibold leading-[1.1] text-obsidian sm:line-clamp-3 sm:text-2xl">
                {product.name}
              </h3>
            </div>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta/70">
              {product.year}
            </span>
          </div>

          {/* SIZE */}
          <fieldset className="mt-3 min-w-0 sm:mt-5">
            <legend className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink/60 sm:mb-2">
              Taille
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => {
                const active = s.id === sizeObj.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    aria-pressed={active}
                    className={`rounded-xl border px-3 py-1.5 text-center text-xs font-bold transition-all duration-300 ${
                      active
                        ? "border-obsidian bg-obsidian text-cream shadow-lg"
                        : "border-sand bg-paper/70 text-ink/75 hover:border-terracotta hover:text-terracotta"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            {/custom|sur mesure|personnalis/i.test(sizeObj.label) && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-glow/15 px-2.5 py-2 text-[11px] leading-snug text-ink/70">
                <Info size={13} className="mt-px shrink-0 text-terracotta" />
                Les dimensions finales sont confirmées avec Samar sur WhatsApp. Ajoutez une note à la commande.
              </p>
            )}
          </fieldset>

          {/* FRAME */}
          <fieldset className="mt-2.5 min-w-0 sm:mt-4">
            <legend className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink/60 sm:mb-2">
              Encadrement
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {frameOptions.map((f) => {
                const active = f.id === frameObj.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrame(f.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-left transition-all duration-300 ${
                      active
                        ? "border-terracotta bg-terracotta/10 text-terracotta shadow-md"
                        : "border-sand bg-paper/70 text-ink/70 hover:border-terracotta/60"
                    }`}
                  >
                    <span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-ink/20" style={{ background: frameStyleFor(f.label).dot }} />
                    <span className="whitespace-nowrap text-xs font-bold leading-tight">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ACTIONS */}
          <div className="mt-auto flex items-center gap-2 pt-3 sm:pt-6">
            <button
              onClick={handleAdd}
              className={`group/btn relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-500 ${
                added ? "bg-[#5f7a4a] text-cream" : "bg-terracotta text-cream hover:shadow-xl hover:shadow-terracotta/30"
              }`}
            >
              {!added && (
                <span className="absolute inset-0 -translate-x-full bg-sienna transition-transform duration-500 group-hover/btn:translate-x-0" />
              )}
              <span className="relative flex items-center gap-2">
                {added ? (
                  <>
                    <Check size={16} strokeWidth={3} /> Ajouté
                  </>
                ) : (
                  <>
                    <Plus size={16} strokeWidth={3} /> Ajouter · {price.toLocaleString("fr-TN")} TND
                  </>
                )}
              </span>
            </button>
            <button
              onClick={() => {
                handleAdd();
                setTimeout(openCart, 450);
              }}
              aria-label={`Commander ${product.name} maintenant`}
              title="Commander maintenant"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition hover:border-[#4b8060] hover:bg-[#4b8060] hover:text-white"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  GALLERY (filters + grid)                                           */
/* ------------------------------------------------------------------ */

const FIRST_BATCH = 8; // paintings shown at first
const NEXT_BATCH = 10; // paintings added per "Voir plus"

function Gallery() {
  const { products, categories, loading, error } = useCatalog();
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(FIRST_BATCH);

  // the navbar sub-links ask the gallery to open a given category
  useEffect(() => {
    const onFilter = (e) => {
      setFilter(e.detail || "all");
      setShown(FIRST_BATCH);
    };
    window.addEventListener("samart:filter", onFilter);
    return () => window.removeEventListener("samart:filter", onFilter);
  }, []);
  const CATEGORIES = useMemo(
    () => [{ id: "all", label: "Toutes les œuvres" }, ...categories],
    [categories]
  );
  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter, products]
  );
  const counts = useMemo(
    () =>
      CATEGORIES.reduce((acc, c) => {
        acc[c.id] = c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length;
        return acc;
      }, {}),
    [CATEGORIES, products]
  );

  return (
    <section id="gallery" className="grain relative bg-cream pb-20 pt-10 sm:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Filters */}
        <Reveal delay={100} className="sticky top-[4.5rem] z-30 -mx-5 px-5 sm:-mx-8 sm:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto py-3">
            {CATEGORIES.map((c) => {
              const active = filter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setFilter(c.id);
                    setShown(FIRST_BATCH);
                  }}
                  className={`group flex shrink-0 items-center gap-2 rounded-full border px-6 py-3 text-xs font-extrabold uppercase tracking-[0.18em] backdrop-blur-md transition-all duration-500 ${
                    active
                      ? "border-obsidian bg-obsidian text-cream shadow-xl shadow-obsidian/20"
                      : "border-ink/15 bg-cream/80 text-ink/70 hover:border-terracotta hover:text-terracotta"
                  }`}
                >
                  {c.label}
                  <span
                    className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] ${
                      active ? "bg-amber-glow text-obsidian" : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {counts[c.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <div
          key={filter}
          className="mt-6 grid grid-cols-1 [&>*]:min-w-0 gap-x-7 gap-y-5 sm:mt-10 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3"
        >
          {visible.slice(0, shown).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-sand/60" />
            ))}
          {!loading && visible.length === 0 && (
            <p className="col-span-full py-16 text-center text-ink/65">
              {error ? "La collection est momentanément indisponible. Réessayez dans un instant." : "Aucune œuvre dans cette catégorie."}
            </p>
          )}
        </div>

        {/* Voir plus / Voir moins */}
        {!loading && visible.length > FIRST_BATCH && (
          <div className="mt-12 flex flex-col items-center gap-4 sm:mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/60">
              {Math.min(shown, visible.length)} sur {visible.length} œuvres
            </p>
            <div className="h-px w-40 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full bg-terracotta transition-all duration-700"
                style={{ width: `${(Math.min(shown, visible.length) / visible.length) * 100}%` }}
              />
            </div>
            {shown < visible.length ? (
              <button
                type="button"
                onClick={() => setShown((n) => n + NEXT_BATCH)}
                className="group relative inline-flex w-full max-w-sm items-center justify-center gap-3 overflow-hidden rounded-full border border-terracotta px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-terracotta transition duration-300 hover:text-cream active:scale-[0.98] sm:w-auto"
              >
                <span aria-hidden className="absolute inset-0 -translate-x-full bg-terracotta transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative">Voir plus</span>
                <ChevronDown size={18} className="relative transition group-hover:translate-y-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShown(FIRST_BATCH);
                  document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-bold uppercase tracking-[0.18em] text-ink/70 underline decoration-terracotta/50 underline-offset-8 transition hover:text-terracotta"
              >
                Voir moins
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PUBLIC COMPONENT                                                   */
/* ------------------------------------------------------------------ */

export default function GalleryShowcase({ ready = true }) {
  return (
    <>
      <Hero ready={ready} />
      <Gallery />
    </>
  );
}
