import { useEffect, useRef, useCallback, type ReactNode } from "react";
import gsap from "gsap";

/* ═══════════════════════════════════════════════════════════
   AMR AI — Magnetic Element Hook
   Elements that gravitationally pull toward the cursor
   ═══════════════════════════════════════════════════════════ */

interface MagneticOptions {
  strength?: number;
  ease?: number;
  radius?: number;
}

export function useMagnetic<T extends HTMLElement>(options: MagneticOptions = {}) {
  const { strength = 0.4, ease = 0.15, radius = 150 } = options;
  const ref = useRef<T>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const animate = useCallback(() => {
    const pos = posRef.current;
    pos.x += (pos.tx - pos.x) * ease;
    pos.y += (pos.ty - pos.y) * ease;

    if (ref.current) {
      ref.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }

    // Stop animation when close to rest
    if (Math.abs(pos.tx - pos.x) > 0.01 || Math.abs(pos.ty - pos.y) > 0.01) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [ease]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength;
        posRef.current.tx = dx * pull;
        posRef.current.ty = dy * pull;
      } else {
        posRef.current.tx = 0;
        posRef.current.ty = 0;
      }

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      posRef.current.tx = 0;
      posRef.current.ty = 0;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    // Use the parent or document for wider detection area
    const container = el.closest("section") || document;
    container.addEventListener("pointermove", onMove as unknown as EventListener, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      container.removeEventListener("pointermove", onMove as unknown as EventListener);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, radius, strength]);

  return ref;
}

/* Magnetic wrapper component */
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: React.ElementType;
}

export function Magnetic({ children, className = "", strength = 0.4, as: Tag = "div" }: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>({ strength });

  return (
    <Tag ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </Tag>
  );
}

/* Enhanced magnetic button with spring physics */
export function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  target,
  rel,
  type = "button",
  "data-cursor-label": cursorLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  "data-cursor-label"?: string;
}) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onEnter = () => {
      boundsRef.current = el.getBoundingClientRect();
    };

    const onMove = (e: globalThis.MouseEvent) => {
      if (!boundsRef.current) return;
      const b = boundsRef.current;
      const x = e.clientX - b.left - b.width / 2;
      const y = e.clientY - b.top - b.height / 2;

      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
      });
      boundsRef.current = null;
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove as unknown as EventListener);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove as unknown as EventListener);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const props = {
    ref: ref as any,
    className: `will-change-transform ${className}`,
    "data-cursor-label": cursorLabel,
  };

  if (href) {
    return (
      <a {...props} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button {...props} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
