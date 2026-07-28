import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicAtmosphere } from "../lib/atmosphere";
import { STATS, waLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   AMR AI — CINEMATIC HERO
   Full immersive movie title sequence
   ═══════════════════════════════════════════════════════════ */

function TextScramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    const el = ref.current!;
    const final = text;
    let frame = 0;
    let queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    for (let i = 0; i < final.length; i++) {
      queue.push({
        from: chars[Math.floor(Math.random() * chars.length)],
        to: final[i],
        start: Math.floor(Math.random() * 20),
        end: Math.floor(Math.random() * 20) + 20,
      });
    }

    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i];
        let char = queue[i].char;
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }
      el.textContent = output;
      if (complete === queue.length) return;
      frame++;
      requestAnimationFrame(update);
    };

    const timer = setTimeout(update, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span ref={ref} aria-label={text} />;
}

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const atm = new CinematicAtmosphere(canvasRef.current!);
    atm.init();
    return () => atm.destroy();
  }, []);

  useEffect(() => {
    if (!ready) return;

    // Sequence: preloader done → wait → show content
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!showContent) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Dark overlay fades
      tl.fromTo(".hero-overlay",
        { opacity: 1 },
        { opacity: 0, duration: 2, ease: "power2.inOut" }
      );

      // "AMR" slides up from below with dramatic timing
      tl.fromTo(".hero-amr",
        { opacity: 0, y: 120, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.6, ease: "power3.out" },
        "-=1.2"
      );

      // "AI" fades in with glow
      tl.fromTo(".hero-ai",
        { opacity: 0, scale: 1.3, filter: "blur(20px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
        "-=0.8"
      );

      // Tagline types in
      tl.fromTo(".hero-tagline",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.4"
      );

      // Subtitle fades
      tl.fromTo(".hero-sub",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        "-=0.5"
      );

      // CTAs
      tl.fromTo(".hero-cta",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
        "-=0.6"
      );

      // Stats cascade
      tl.fromTo(".hero-stat",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
        "-=0.4"
      );

      // Counter animation
      document.querySelectorAll<HTMLElement>(".hero-stat .num").forEach((el) => {
        const target = Number(el.dataset.value || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.5, delay: 2.5, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
        });
      });

      // Parallax on scroll — content moves away
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (contentRef.current) {
            contentRef.current.style.transform = `translateY(${p * -25}vh) scale(${1 - p * 0.08})`;
            contentRef.current.style.opacity = String(1 - p * 0.9);
          }
        }
      });
    }, root);

    return () => ctx.revert();
  }, [showContent]);

  return (
    <section ref={root} id="top" className="relative min-h-[120vh] overflow-hidden">
      {/* Cinematic atmosphere — fixed behind everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Dark overlay for cinematic fade-in */}
      <div className="hero-overlay fixed inset-0 bg-[#030309] z-[2]" style={{ opacity: 1 }} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(3,3,9,0.85) 100%)" }}
      />

      {/* Film grain */}
      <div className="grain-layer" aria-hidden="true" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
      >
        {/* Brand mark */}
        <div className="mb-6">
          <span className="hero-tagline opacity-0 text-[10px] tracking-[0.6em] uppercase text-[#5fd4ff] font-medium">
            Neural Genesis
          </span>
        </div>

        {/* Main Title — AMR AI */}
        <div className="overflow-hidden mb-8" style={{ perspective: "1000px" }}>
          <h1 className="font-black leading-[0.82] tracking-[-0.05em]">
            <span
              className="hero-amr block opacity-0 text-white"
              style={{ fontSize: "clamp(5rem, 22vw, 20rem)" }}
            >
              AMR
            </span>
            <span
              className="hero-ai block opacity-0"
              style={{
                fontSize: "clamp(5rem, 22vw, 20rem)",
                color: "transparent",
                WebkitTextStroke: "3px rgba(95,212,255,0.7)",
                textShadow: "0 0 60px rgba(41,171,226,0.4), 0 0 120px rgba(41,171,226,0.15)",
              }}
            >
              AI
            </span>
          </h1>
        </div>

        {/* Arabic tagline */}
        <p className="hero-sub opacity-0 text-xl md:text-2xl text-white/90 font-medium mb-4 max-w-xl leading-relaxed">
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
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.5em] text-[#5b6579] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#29abe2] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
