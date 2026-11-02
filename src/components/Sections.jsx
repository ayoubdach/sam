import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Reveal, useInView } from "../hooks/useReveal";
import { BRAND, WHATSAPP_NUMBER } from "../config";

const commissionLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Bonjour Samar 👋 J'aimerais discuter d'une création sur mesure de Sam'Art Gallery."
)}`;

/* Brand icons (inline SVG – lucide dropped brand logos) */
const Instagram = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Facebook = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTok = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  CONTACT CTA + FOOTER                                               */
/* ------------------------------------------------------------------ */
const HEADLINE = "Une idée en tête ? Peignons-la.";

function ContactBand() {
  const [ref, visible] = useInView({ threshold: 0.3 });
  const words = HEADLINE.split(" ");
  return (
    <section id="contact" ref={ref} className={`contact-band ${visible ? "is-visible" : ""}`}>
      <div aria-hidden className="contact-glow" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="contact-title font-display text-[2.8rem] font-medium italic leading-[1.05] tracking-tight sm:text-7xl">
          {words.map((w, i) => (
            <span key={i} className="contact-word" style={{ "--i": i }}>
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h2>
        <span aria-hidden className="contact-rule" />
        <p className="contact-sub mx-auto mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
          Commandes sur mesure, cadeaux d'entreprise et projets de décoration : racontez-nous votre idée.
        </p>
        <a href={commissionLink} target="_blank" rel="noopener noreferrer" className="wa-btn group">
          <MessageCircle size={20} />
          <span>Écrire sur WhatsApp</span>
          <ArrowUpRight size={16} className="wa-arrow" />
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  const social =
    "grid h-12 w-12 place-items-center rounded-full border border-obsidian/25 text-obsidian transition duration-300 hover:border-terracotta hover:bg-terracotta hover:text-cream";
  return (
    <>
      {/* CTA band */}
      <ContactBand />

      {/* Footer */}
      <footer className="bg-sand text-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-28 pt-12 sm:px-8 sm:pb-10 sm:pt-16">
          <div className="flex flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-4xl font-medium leading-none">
                Sam'Art <em className="pr-1 font-normal italic text-terracotta">Gallery</em>
              </p>
              <p className="mt-3 text-sm text-ink/65">Tunis, Tunisie</p>
            </div>
            <div className="flex gap-3">
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
                <Instagram size={20} />
              </a>
              <a href={commissionLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
                <MessageCircle size={20} />
              </a>
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}>
                <Facebook size={20} />
              </a>
              <a href={BRAND.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={social}>
                <TikTok size={20} />
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-obsidian/15 pt-6 text-center text-xs text-ink/65 sm:flex-row sm:pr-20 sm:text-left">
            <p>© {new Date().getFullYear()} Sam'Art Gallery · Samar Saddouri. Tous droits réservés.</p>
            <p className="font-display text-base italic">Fait main avec ❤ en Tunisie</p>
          </div>
        </div>
      </footer>
    </>
  );
}
