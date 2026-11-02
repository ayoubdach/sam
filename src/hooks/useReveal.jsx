import { useEffect, useRef, useState } from "react";

/** Returns [ref, visible] – flips to true once the element enters the viewport. */
export function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}

/** Scroll-reveal wrapper. */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", variant = "reveal" }) {
  const [ref, visible] = useInView();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${variant} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Animated counter that counts up when visible. */
export function Counter({ to, suffix = "", duration = 1800 }) {
  const [ref, visible] = useInView({ threshold: 0.4 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
