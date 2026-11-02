import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, ChevronDown, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../data/CatalogContext";

const LINKS = [
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ ready = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const { itemCount, openCart } = useCart();
  const { products, categories } = useCatalog();
  const counts = Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length]));

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(max > 0 ? (y / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setMenu(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  // open the gallery on a given category (sub-links under "Gallery")
  const goCategory = (id) => {
    window.dispatchEvent(new CustomEvent("samart:filter", { detail: id }));
    setMenu(false);
    setTimeout(() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }), 160);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-700 ${
        ready ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${scrolled ? "bg-cream/85 shadow-[0_10px_40px_-20px_rgba(90,50,20,0.4)] backdrop-blur-xl" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <button onClick={() => go("top")} className="group flex items-baseline gap-1" aria-label="Sam'Art Gallery, home">
          <span className={`font-display text-3xl font-semibold italic tracking-tight transition-colors duration-500 ${scrolled ? "text-obsidian" : "text-cream"}`}>
            Sam<span className={scrolled ? "text-terracotta" : "text-amber-glow"}>'</span>Art
          </span>
          <span className={`hidden text-[9px] font-extrabold uppercase tracking-[0.35em] transition group-hover:text-terracotta sm:block ${scrolled ? "text-ink/60" : "text-cream/60"}`}>
            Gallery
          </span>
        </button>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => {
            const linkCls = `relative flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:text-terracotta after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-terracotta after:transition-transform hover:after:scale-x-100 ${scrolled ? "text-ink/70" : "text-cream/80"}`;
            if (l.id !== "gallery" || categories.length === 0)
              return (
                <button key={l.id} onClick={() => go(l.id)} className={linkCls}>
                  {l.label}
                </button>
              );
            return (
              <div key={l.id} className="group relative">
                <button onClick={() => goCategory("all")} className={linkCls} aria-haspopup="true">
                  {l.label}
                  <ChevronDown size={13} className="transition duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                {/* dropdown */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ul className="w-64 overflow-hidden rounded-2xl border border-sand bg-paper p-2 shadow-[0_30px_60px_-20px_rgba(43,29,22,0.45)]">
                    <li>
                      <button
                        onClick={() => goCategory("all")}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-[0.18em] text-terracotta transition hover:bg-terracotta/10"
                      >
                        Toutes les œuvres
                        <ArrowUpRight size={14} />
                      </button>
                    </li>
                    {categories.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => goCategory(c.id)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left font-display text-lg italic leading-tight text-obsidian transition hover:bg-terracotta/10 hover:text-terracotta"
                        >
                          {c.label}
                          <span className="font-sans text-[10px] not-italic text-ink/50">{counts[c.id]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className={`relative hidden items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.15em] transition hover:border-obsidian hover:bg-obsidian hover:text-cream sm:flex ${scrolled ? "border-ink/20" : "border-cream/40 text-cream"}`}
          >
            <ShoppingBag size={15} /> Bag
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[10px] text-cream">
              {itemCount}
            </span>
          </button>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label="Toggle menu"
            className={`grid h-11 w-11 place-items-center rounded-full border transition-colors md:hidden ${scrolled ? "border-ink/20" : "border-cream/40 bg-obsidian/30 text-cream backdrop-blur-sm"}`}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`overflow-hidden bg-obsidian text-cream transition-all duration-500 md:hidden ${
          menu ? "max-h-[36rem]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-5">
          {LINKS.map((l, i) => (
            <div key={l.id} className="border-b border-white/10">
              <button
                onClick={() => go(l.id)}
                className="flex w-full items-baseline gap-3 py-3 text-left font-display text-3xl italic"
              >
                <span className="font-sans text-[10px] not-italic text-gold">0{i + 1}</span>
                {l.label}
              </button>
              {l.id === "gallery" && categories.length > 0 && (
                <ul className="mb-3 ml-[1.35rem] space-y-0.5 border-l border-amber-glow/40 pl-4">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => goCategory(c.id)}
                        className="flex w-full items-center justify-between py-2 pr-1 text-left font-display text-xl italic text-cream/80 transition active:text-amber-glow"
                      >
                        {c.label}
                        <span className="font-sans text-[10px] not-italic text-cream/45">{counts[c.id]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* scroll progress */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-terracotta via-amber-glow to-gold"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
