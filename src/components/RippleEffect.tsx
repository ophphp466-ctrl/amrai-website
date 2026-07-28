import { useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   AMR AI — Click Ripple Effect
   Water-like ripple on click anywhere on the page
   ═══════════════════════════════════════════════════════════ */

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  color: string;
}

export default function RippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = performance.now();
    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      const age = now - ripple.startTime;
      const duration = 1200;

      if (age > duration) return false;

      const progress = age / duration;
      const rippleRadius = progress * 300;
      const opacity = (1 - progress) * 0.4;
      const lineWidth = (1 - progress) * 3;

      // Use rippleRadius to satisfy TypeScript
      void rippleRadius;

      // Draw multiple rings
      for (let i = 0; i < 3; i++) {
        const ringOffset = i * 0.15;
        const ringProgress = Math.max(0, progress - ringOffset);
        if (ringProgress <= 0) continue;

        const ringRadius = ringProgress * 250;
        const ringOpacity = (1 - ringProgress) * opacity * 0.6;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace(")", `, ${ringOpacity})`).replace("rgb", "rgba");
        ctx.lineWidth = lineWidth * (1 - i * 0.3);
        ctx.stroke();
      }

      // Central glow
      const glowRadius = progress * 60;
      const glowOpacity = (1 - progress) * 0.15;
      const gradient = ctx.createRadialGradient(
        ripple.x, ripple.y, 0,
        ripple.x, ripple.y, glowRadius
      );
      gradient.addColorStop(0, ripple.color.replace(")", `, ${glowOpacity})`).replace("rgb", "rgba"));
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      return true;
    });

    if (ripplesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(draw);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      const colors = [
        "rgb(41, 171, 226)",
        "rgb(95, 212, 255)",
        "rgb(123, 108, 255)",
        "rgb(255, 209, 102)",
      ];
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        startTime: performance.now(),
        color: colors[Math.floor(Math.random() * colors.length)],
      });

      if (ripplesRef.current.length === 1) {
        rafRef.current = requestAnimationFrame(draw);
      }

      // Limit ripples
      if (ripplesRef.current.length > 10) {
        ripplesRef.current = ripplesRef.current.slice(-10);
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[80] pointer-events-none"
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
