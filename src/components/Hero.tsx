import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HeroShader } from "../lib/shader";
import { splitLines } from "../lib/fx";
import { STATS, waLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";

/* ═══════════════════════════════════════════════════════════
   AMR AI — Neural Genesis Hero
   Massive Arabic typography + living neural shader
   ═══════════════════════════════════════════════════════════ */

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const shader = new HeroShader(canvasRef.current!);
    shader.init();
    return () => shader.destroy();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Title: each line reveals with weight
      document.querySelectorAll<HTMLElement>(".hero-title .split-me").forEach((el, li) => {
        const spans = splitLines(el);
        gsap.to(spans, {
          y: 0, 
          duration: 1.2, 
          ease: "power4.out",
          stagger: 0.06, 
          delay: 0.2 + li * 0.18,
          onStart: () => el.classList.add("done"),
        });
      });
      
      // Subtle fade-ins
      gsap.fromTo(".hero-fade", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.9, ease: "power3.out",
      });
      
      // Stats counter animation
      document.querySelectorAll<HTMLElement>(".hero-stat .num").forEach((el) => {
        const target = Number(el.dataset.value || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.5, delay: 1.4, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
        });
      });
      
      // Parallax on scroll
      gsap.to(".hero-content", {
        yPercent: -20, 
        opacity: 0.1, 
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(canvasRef.current, {
        scale: 1.08, 
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={root} id="top" className="relative min-h-screen overflow-hidden">
      {/* Neural shader background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030309]/40 via-transparent to-[#030309]" />

      <div className="hero-content relative z-10 shell min-h-screen flex flex-col justify-center pt-28 pb-20">
        {/* Kicker */}
        <div className="hero-fade kicker mb-8 opacity-0">
          <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse" />
          AMR AI · NEURAL GENESIS
        </div>

        {/* MASSIVE title */}
        <h1 ref={titleRef} className="hero-title max-w-6xl">
          <span className="split-me block hero-line">نحوّل الأفكار</span>
          <span className="split-me block hero-line">إلى <span className="text-[#29abe2]">واقعٍ رقميٍ</span></span>
          <span className="split-me block hero-line">ذكي<span className="text-[#29abe2]">.</span></span>
        </h1>

        {/* Subtitle */}
        <p className="hero-fade lead max-w-xl mt-10 text-lg opacity-0">
          نصمّم تجارب رقمية تدمج الذكاء الاصطناعي مع تصميم سينمائي عالمي — 
          من فكرة إلى منتج يُحدث فارقًا.
        </p>

        {/* CTAs */}
        <div className="hero-fade flex flex-wrap items-center gap-4 mt-10 opacity-0">
          <a href={waLink("مرحبًا Amr AI، أريد بدء مشروع جديد.")} target="_blank" rel="noreferrer" className="btn btn-primary">
            ابدأ مشروعك
          </a>
          <button onClick={() => scrollToId("services")} className="btn btn-ghost">
            اكتشف المزيد
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap gap-8 max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="num-latin text-4xl font-black text-white">
                <span className="num" data-value={s.value}>0</span><span className="text-[#29abe2]">{s.suffix}</span>
              </div>
              <div className="text-sm text-[#5b6579] font-bold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-fade absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#5b6579]">
        <span className="text-[10px] font-bold tracking-[0.4em] latin">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#29abe2] to-transparent" />
      </div>
    </section>
  );
}
