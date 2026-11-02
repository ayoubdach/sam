import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Check, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatTND } from "../config";

export default function FloatingCartButton() {
  const { itemCount, subtotal, openCart, isOpen, lastAdded, dismissToast } = useCart();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(itemCount);

  // The bag only shows once the visitor reaches the gallery (or as soon as the cart has something)
  const [inGallery, setInGallery] = useState(false);
  useEffect(() => {
    const check = () => {
      const gallery = document.getElementById("gallery");
      setInGallery(gallery ? gallery.getBoundingClientRect().top < window.innerHeight * 0.7 : true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  const hidden = isOpen || !(inGallery || itemCount > 0);

  // Bounce whenever the number of items increases
  useEffect(() => {
    if (itemCount > prevCount.current) {
      // wait for the "fly" animation to land
      const t1 = setTimeout(() => setBump(true), 650);
      const t2 = setTimeout(() => setBump(false), 1250);
      prevCount.current = itemCount;
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  // Auto-hide toast
  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissToast, 3600);
    return () => clearTimeout(t);
  }, [lastAdded, dismissToast]);

  return (
    <>
      {/* Toast */}
      {lastAdded && !isOpen && (
        <div
          key={lastAdded.stamp}
          className="animate-toast fixed bottom-28 right-4 z-40 w-[min(20rem,calc(100vw-2rem))] sm:right-8"
          role="status"
        >
          <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-gold/40 bg-obsidian/95 p-3 pr-10 text-cream shadow-2xl shadow-obsidian/40 backdrop-blur-xl">
            <img
              src={lastAdded.image}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-glow">
                <Check size={12} strokeWidth={3} /> Added to your collection
              </p>
              <p className="truncate font-display text-lg leading-tight">{lastAdded.name}</p>
              <p className="text-xs text-cream/60">
                {lastAdded.sizeLabel} · {lastAdded.frameLabel}
              </p>
            </div>
            <button
              onClick={dismissToast}
              aria-label="Dismiss"
              className="absolute right-2 top-2 rounded-full p-1 text-cream/50 transition hover:bg-white/10 hover:text-cream"
            >
              <X size={14} />
            </button>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left animate-[shrink_3.6s_linear_forwards] bg-gradient-to-r from-gold to-terracotta" />
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        id="floating-cart-btn"
        onClick={openCart}
        aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        aria-hidden={hidden}
        tabIndex={hidden ? -1 : 0}
        className={`group fixed bottom-6 right-4 z-40 flex items-center gap-3 rounded-full bg-obsidian py-2 pl-2 text-cream shadow-2xl shadow-obsidian/40 ring-1 ring-gold/50 transition-all duration-500 hover:ring-2 hover:ring-amber-glow sm:right-8 ${
          itemCount > 0 ? "pr-5" : "pr-2"
        } ${hidden ? "pointer-events-none translate-y-24 opacity-0" : ""}`}
      >
        {/* pulsing halo when the cart has something */}
        {itemCount > 0 && (
          <span className="pointer-events-none absolute inset-0 animate-ping-soft rounded-full bg-amber-glow/40" />
        )}

        <span
          className={`relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-amber-glow via-clay to-terracotta text-obsidian ${
            bump ? "animate-bump" : ""
          }`}
        >
          <ShoppingBag size={24} strokeWidth={2} />
          <span
            className={`absolute -right-1 -top-1 grid min-h-6 min-w-6 place-items-center rounded-full border-2 border-obsidian bg-cream px-1 text-[11px] font-extrabold text-obsidian transition-transform duration-300 ${
              itemCount > 0 ? "scale-100" : "scale-0"
            }`}
          >
            {itemCount}
          </span>
        </span>

        {itemCount > 0 && (
          <span className="relative hidden flex-col items-start leading-none sm:flex">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-cream/50">
              Your bag
            </span>
            <span className="mt-1 font-display text-xl font-semibold text-gold">
              {formatTND(subtotal)}
            </span>
          </span>
        )}
      </button>

      <style>{`@keyframes shrink { from { transform: scaleX(1); } to { transform: scaleX(0); } }`}</style>
    </>
  );
}
