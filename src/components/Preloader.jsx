import { useEffect, useState } from "react";

/** Cinematic intro curtain. Calls onDone once the curtain has lifted. */
export default function Preloader({ onReveal = () => {}, onDone = () => {} }) {
  const [phase, setPhase] = useState("in"); // in -> out -> gone

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("out");
      onReveal?.();
    }, 2100);
    const t2 = setTimeout(() => {
      setPhase("gone");
      onDone?.();
    }, 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;

  const letters = "Sam'Art".split("");

  return (
    <div
      className={`grain grain-dark fixed inset-0 z-[200] grid place-items-center bg-obsidian text-cream transition-transform duration-[1000ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
        phase === "out" ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{ borderBottomLeftRadius: phase === "out" ? "50% 12vh" : 0, borderBottomRightRadius: phase === "out" ? "50% 12vh" : 0 }}
      aria-hidden
    >
      <div className="pointer-events-none absolute h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-terracotta/40 to-amber-glow/20 blur-3xl" />
      <div className="relative z-10 text-center">
        <div className="flex justify-center overflow-hidden pb-3">
          {letters.map((l, i) => (
            <span
              key={i}
              className="animate-rise inline-block font-display text-7xl font-medium italic sm:text-9xl"
              style={{ animationDelay: `${200 + i * 90}ms`, animationDuration: "1s" }}
            >
              {l === "'" ? <span className="text-gold">'</span> : l}
            </span>
          ))}
        </div>
        <p
          className="animate-rise mt-1 text-[11px] font-bold uppercase tracking-[0.6em] text-gold"
          style={{ animationDelay: "1000ms" }}
        >
          Gallery · Tunis
        </p>
        <div className="mx-auto mt-8 h-px w-56 overflow-hidden bg-white/10">
          <div
            className="h-full origin-left bg-gradient-to-r from-terracotta via-amber-glow to-gold"
            style={{ animation: "load 1.8s cubic-bezier(0.65,0,0.35,1) 0.2s both" }}
          />
        </div>
      </div>
      <style>{`@keyframes load { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}
