import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS, waLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   AMR AI — The Line
   One continuous line of light traverses the entire page.
   Everything orbits around this single thread.
   ═══════════════════════════════════════════════════════════ */

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Line draws itself down
      gsap.fromTo(lineRef.current, 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 2, ease: "power3.inOut", delay: 0.3 }
      );

      // Title fades in from sides
      gsap.fromTo(".hero-title-char", 
        { opacity: 0, x: (i: number) => (i % 2 === 0 ? -40 : 40) },
        { opacity: 1, x: 0, duration: 1.2, stagger: 0.05, ease: "power3.out", delay: 0.8 }
      );

      // Subtitle and CTAs
      gsap.fromTo(".hero-fade", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 1.4 }
      );

      // Stats counter
      document.querySelectorAll<HTMLElement>(".hero-stat .num").forEach((el) => {
        const target = Number(el.dataset.value || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.5, delay: 1.8, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
        });
      });

      // Line continues on scroll
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (lineRef.current) {
            lineRef.current.style.opacity = String(1 - self.progress * 0.5);
          }
        }
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  const titleChars = "AMR AI".split("").map((c, i) => (
    <span key={i} className="hero-title-char inline-block" style={{ transitionDelay: `${i * 50}ms` }}>
      {c === " " ? "\u00A0" : c}
    </span>
  ));

  return (
    <section ref={root} id="top" className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* The Line — central axis */}
      <div 
        ref={lineRef}
        className="absolute left-1/2 top-0 bottom-0 w-px origin-top"
        style={{ 
          background: "linear-gradient(180deg, transparent 0%, #29abe2 15%, #5fd4ff 50%, #29abe2 85%, transparent 100%)",
          transform: "translateX(-50%) scaleY(0)",
          boxShadow: "0 0 20px rgba(41,171,226,0.4), 0 0 60px rgba(41,171,226,0.15)"
        }}
      />

      {/* Subtle radial glow around the line */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(41,171,226,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Kicker */}
        <div className="hero-fade opacity-0 mb-8">
          <span className="text-[11px] tracking-[0.5em] uppercase text-[#5fd4ff] font-medium">Neural Genesis</span>
        </div>

        {/* Main Title — AMR AI */}
        <h1 
          ref={titleRef}
          className="font-black tracking-[-0.04em] leading-none mb-6"
          style={{ fontSize: "clamp(4rem, 12vw, 14rem)" }}
        >
          {titleChars}
        </h1>

        {/* Arabic tagline */}
        <p className="hero-fade opacity-0 text-lg md:text-xl text-[#9aa5bc] font-medium mb-4 max-w-lg mx-auto leading-relaxed">
          نحوّل الأفكار إلى واقعٍ رقميٍ ذكي
        </p>

        {/* Subtitle */}
        <p className="hero-fade opacity-0 text-sm text-[#5b6579] max-w-md mx-auto mb-10 leading-relaxed">
          نصمّم تجارب رقمية تدمج الذكاء الاصطناعي مع تصميم سينمائي عالمي
        </p>

        {/* CTAs */}
        <div className="hero-fade opacity-0 flex flex-wrap items-center justify-center gap-4">
          <a href={waLink("مرحبًا Amr AI، أريد بدء مشروع جديد.")} target="_blank" rel="noreferrer" className="btn btn-primary">
            ابدأ مشروعك
          </a>
          <button onClick={() => scrollToId("services")} className="btn btn-ghost">
            اكتشف المزيد
          </button>
        </div>

        {/* Stats row */}
        <div className="hero-fade opacity-0 mt-20 flex flex-wrap justify-center gap-10 md:gap-16">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat text-center">
              <div className="num-latin text-3xl md:text-4xl font-black text-white mb-1">
                <span className="num" data-value={s.value}>0</span><span className="text-[#29abe2]">{s.suffix}</span>
              </div>
              <div className="text-xs text-[#5b6579] font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-fade opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold tracking-[0.4em] text-[#5b6579] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#29abe2] to-transparent" />
      </div>
    </section>
  );
}
