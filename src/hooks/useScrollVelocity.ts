import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   AMR AI — Scroll Velocity Hook
   Tracks scroll speed for velocity-based effects
   ═══════════════════════════════════════════════════════════ */

interface VelocityState {
  velocity: number;
  direction: number; // -1 (up) or 1 (down)
  skew: number;
  scale: number;
}

export function useScrollVelocity() {
  const stateRef = useRef<VelocityState>({ velocity: 0, direction: 1, skew: 0, scale: 1 });
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef(0);

  useEffect(() => {
    let decay = 0;

    const update = () => {
      const now = performance.now();
      const currentScroll = window.scrollY;
      const deltaTime = now - lastTimeRef.current;

      if (deltaTime > 0) {
        const deltaScroll = currentScroll - lastScrollRef.current;
        const rawVelocity = (deltaScroll / deltaTime) * 16; // normalize to ~60fps

        // Smooth velocity with decay
        decay += (rawVelocity - decay) * 0.1;
        stateRef.current.velocity = decay;
        stateRef.current.direction = deltaScroll >= 0 ? 1 : -1;

        // Calculate skew based on velocity (clamped)
        const targetSkew = Math.max(-3, Math.min(3, decay * 0.15));
        stateRef.current.skew += (targetSkew - stateRef.current.skew) * 0.08;

        // Scale based on velocity (slight stretch)
        const targetScale = 1 + Math.abs(decay) * 0.001;
        stateRef.current.scale += (Math.min(targetScale, 1.03) - stateRef.current.scale) * 0.08;
      }

      lastScrollRef.current = currentScroll;
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return stateRef;
}

/* Apply velocity skew to elements */
export function useVelocitySkew(selector: string) {
  const velocityRef = useScrollVelocity();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === 0) return;

    let raf = 0;

    const apply = () => {
      const { skew, scale } = velocityRef.current;
      elements.forEach((el) => {
        el.style.transform = `skewY(${skew}deg) scaleY(${scale})`;
      });
      raf = requestAnimationFrame(apply);
    };

    raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [selector, velocityRef]);
}
