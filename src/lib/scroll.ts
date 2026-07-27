import Lenis from "lenis";

/* نسخة Lenis عامة واحدة للتمرير الحريري */
let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    duration: 1.25,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });
  return lenis;
}

export function getLenis() { return lenis; }

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}
