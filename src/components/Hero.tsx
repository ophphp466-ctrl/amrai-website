import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicAtmosphere } from "../lib/atmosphere";
import { STATS, waLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   AMR AI — CINEMATIC HERO
   Full-viewport immersive opening. Like a movie title sequence.
   ═══════════════════════════════════════════════════════════ */

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const atm = new CinematicAtmosphere(canvasRef.current!);
    atm.init();
    return () => atm.destroy();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Cinematic fade-in sequence
      const tl = gsap.timeline({ delay: 0.2 });

      // Overlay fades to reveal background
      tl.to(overlayRef.current, { opacity: 0, duration: 2, ease: "power2.inOut" });

      // "AMR" appears — dramatic
      tl.fromTo(".hero-brand-1",
        { opacity: 0, y: 80, scale: 1.1 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        "-=1.2"
      );

      // "AI" appears with slight delay
      tl.fromTo(".hero-brand-2",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      );

      // Tagline types in
      tl.fromTo(".hero-tagline",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.4"
      );

      // Subtitle
      tl.fromTo(".hero-sub",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        "-=0.3"
      );

      // CTAs
      tl.fromTo(".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
        "-=0.6"
      );

      // Stats cascade
      tl.fromTo(".hero-stat",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
        "-=0.4"
      );

      // Counter animation for stats
      document.querySelectorAll<HTMLElement>(".hero-stat .num").forEach((el) => {
        const target = Number(el.dataset.value || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.5, delay: 2, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
        });
      });

      // Parallax on scroll — hero fades and shrinks
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (titleRef.current) {
            titleRef.current.style.transform = `translateY(${p * -30}vh) scale(${1 - p * 0.1})`;
            titleRef.current.style.opacity = String(1 - p * 0.8);
          }
        }
      });
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={root} id="top" className="relative min-h-[110vh] overflow-hidden">
      {/* Cinematic atmosphere background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ position: "fixed" }} 
        aria-hidden="true" 
      />

      {/* Dark overlay that fades on load */}
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-[#030309] z-[2]" 
        style={{ opacity: 1 }} 
      />

      {/* Vignette overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ 
          background: "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 0%, rgba(3,3,9,0.7) 100%)" 
        }} 
      />

      {/* Content */}
      <div 
        ref={titleRef} 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
      >
        {/* Brand mark */}
        <div className="mb-8">
          <span className="hero-tagline opacity-0 text-[10px] tracking-[0.6em] uppercase text-[#5fd4ff] font-medium">
            Neural Genesis
          </span>
        </div>

        {/* Main Title */}
        <div className="overflow-hidden mb-6">
          <h1 className="font-black tracking-[-0.06em] leading-[0.85]">
            <span className="hero-brand-1 block opacity-0" style={{ fontSize: "clamp(5rem, 18vw, 18rem)" }}>
              AMR
            </span>
            <span 
              className="hero-brand-2 block opacity-0 text-transparent"
              style={{ 
                fontSize: "clamp(5rem, 18vw, 18rem)",
                WebkitTextStroke: "2px rgba(95,212,255,0.6)",
                textShadow: "0 0 80px rgba(41,171,226,0.3)"
              }}
            >
              AI
            </span>
          </h1>
        </div>

        {/* Arabic tagline */}
        <p className="hero-sub opacity-0 text-xl md:text-2xl text-white/80 font-medium mb-3 max-w-xl leading-relaxed">
          نحوّل الأفكار إلى واقعٍ رقميٍ ذكي
        </p>

        {/* Subtitle */}
        <p className="hero-sub opacity-0 text-sm text-[#5b6579] max-w-md mx-auto mb-12 leading-relaxed">
          نصمّم تجارب رقمية تدمج الذكاء الاصطناعي مع تصميم سينمائي عالمي
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <a href={waLink("مرحبًا Amr AI، أريد بدء مشروع جديد.")} target="_blank" rel="noreferrer" className="hero-cta btn btn-primary opacity-0">
            ابدأ مشروعك
          </a>
          <button onClick={() => scrollToId("work")} className="hero-cta btn btn-ghost opacity-0">
            شاهد أعمالنا
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat opacity-0 text-center">
              <div className="num-latin text-2xl md:text-3xl font-black text-white mb-1">
                <span className="num" data-value={s.value}>0</span>
                <span className="text-[#29abe2]">{s.suffix}</span>
              </div>
              <div className="text-[11px] text-[#5b6579] font-bold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.5em] text-[#5b6579] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#29abe2] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
