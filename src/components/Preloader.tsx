import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ═══════════════════════════════════════════════════════════
   Enhanced Cinematic Preloader v2
   SVG path drawing + glitch text + cinematic curtain reveal
   ═══════════════════════════════════════════════════════════ */

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          // Cinematic curtain reveal
          gsap.to(root.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
              onDone();
            },
          });
        },
      });

      // Phase 1: Logo path drawing
      tl.fromTo(".pl-logo path", 
        { strokeDashoffset: 400, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 2, ease: "power2.inOut", stagger: 0.15 },
        0
      )
      // Phase 2: Glitch text reveal
      .fromTo(".pl-word", 
        { opacity: 0, y: 30, skewX: -8 },
        { opacity: 1, y: 0, skewX: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 },
        0.6
      )
      // Phase 3: Counter
      .to(counter, {
        v: 100, duration: 2.5, ease: "power2.inOut",
        onUpdate: () => setPct(Math.round(counter.v)),
        onStart: () => setPhase(1),
      }, 0.3)
      // Phase 4: Glow pulse
      .to(".pl-logo", {
        filter: "drop-shadow(0 0 30px rgba(95, 212, 255, 0.8))",
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        onStart: () => setPhase(2),
      }, 1.5)
      // Phase 5: Fade out inner content
      .to(".pl-inner", { opacity: 0, y: -40, scale: 0.95, duration: 0.6, ease: "power2.in" }, "+=0.2");
    }, root);
    return () => ctx.revert();
  }, [onDone]);

  const getPhaseText = () => {
    switch (phase) {
      case 0: return "جارٍ التهيئة...";
      case 1: return "تحميل المكونات...";
      case 2: return "جاهز للإطلاق!";
      default: return "";
    }
  };

  return (
    <div ref={root} className="fixed inset-0 z-[400] flex items-center justify-center bg-[#030309]" style={{ clipPath: "inset(0 0 0% 0)" }}>
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(41,171,226,0.3) 0%, transparent 70%)" }} />
      </div>

      <div className="pl-inner flex flex-col items-center gap-8 relative z-10">
        {/* Animated logo */}
        <svg className="pl-logo w-28 h-28" viewBox="0 0 100 100" fill="none" stroke="#5fd4ff" strokeWidth="2.2" strokeLinecap="round">
          <path d="M50 8a14 14 0 0114 14 14 14 0 0110 24 14 14 0 01-4 26 14 14 0 01-20 10 14 14 0 01-20-10 14 14 0 01-4-26 14 14 0 0110-24A14 14 0 0150 8z" strokeDasharray="400" strokeDashoffset="400" />
          <path d="M38 40l-10 10 10 10M62 40l10 10-10 10M54 34l-8 32" strokeDasharray="400" strokeDashoffset="400" />
          {/* Pulse ring */}
          <circle cx="50" cy="50" r="46" stroke="rgba(95,212,255,0.15)" strokeWidth="0.5" strokeDasharray="4 4">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Brand text */}
        <div className="pl-word text-center">
          <div className="latin text-3xl font-bold tracking-[0.4em] text-white">AMR&nbsp;AI</div>
          <div className="mt-3 text-sm text-[#9aa5bc] font-semibold tracking-wide">نحوّل الأفكار إلى واقعٍ رقميٍ ذكي</div>
        </div>

        {/* Phase indicator */}
        <div className="pl-word text-xs text-[#5b6579] font-mono tracking-wider" dir="ltr">
          {getPhaseText()}
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="flex justify-between text-[11px] mono text-[#5b6579] mb-2">
            <span className="tracking-wider">GENESIS EDITION v2.0</span>
            <span className="num-latin text-[#5fd4ff] font-bold">{pct}%</span>
          </div>
          <div className="h-[2px] bg-[#141828] relative overflow-hidden rounded-full">
            <div 
              className="absolute inset-y-0 right-0 rounded-full transition-[width] duration-100"
              style={{ 
                width: `${pct}%`,
                background: "linear-gradient(90deg, #29abe2, #5fd4ff, #7b6cff)",
                boxShadow: "0 0 20px rgba(95,212,255,0.6), 0 0 40px rgba(95,212,255,0.3)"
              }} 
            />
          </div>
        </div>
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#29abe233] rounded-tl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#29abe233] rounded-br-lg" />
    </div>
  );
}
