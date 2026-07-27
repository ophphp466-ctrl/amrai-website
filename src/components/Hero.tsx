import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HeroShader } from "../lib/shader";
import { splitLines } from "../lib/fx";
import { STATS, waLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";

/* البطل: مشهد GLSL حي + تايبوغرافي عربي ضخم + عدادات */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const shader = new HeroShader(canvasRef.current!);
    shader.init();
    return () => shader.destroy();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // كشف العنوان سطرًا سطرًا
      document.querySelectorAll<HTMLElement>(".hero-title .split-me").forEach((el, li) => {
        const spans = splitLines(el);
        gsap.to(spans, {
          y: 0, duration: 1.15, ease: "power4.out",
          stagger: 0.05, delay: 0.15 + li * 0.16,
          onStart: () => el.classList.add("done"),
        });
      });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 1, stagger: 0.09, delay: 0.75, ease: "power3.out",
      });
      gsap.fromTo(".hero-stat", { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 1.15, ease: "power3.out",
      });
      // عدادات الأرقام
      document.querySelectorAll<HTMLElement>(".hero-stat .num").forEach((el) => {
        const target = Number(el.dataset.value || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.2, delay: 1.3, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
        });
      });
      // parallax عند التمرير
      gsap.to(".hero-content", {
        yPercent: -18, opacity: 0.15, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(canvasRef.current, {
        scale: 1.12, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      // ميل ثلاثي الأبعاد مع حركة المؤشر
      const content = document.querySelector(".hero-content")!;
      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / innerWidth - 0.5) * 2;
        const ny = (e.clientY / innerHeight - 0.5) * 2;
        gsap.to(content, { rotateY: nx * 2.2, rotateX: -ny * 1.6, transformPerspective: 1200, duration: 0.9, ease: "power2.out" });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={root} id="top" className="relative min-h-screen overflow-hidden">
      {/* مشهد GLSL الحي */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030309]/30 via-transparent to-[#030309]" />

      <div className="hero-content relative z-10 shell min-h-screen flex flex-col justify-center pt-28 pb-16 will-change-transform">
        <div className="hero-fade kicker mb-7">AMR AI · GENESIS EDITION 2026</div>

        <h1 className="hero-title display-1 max-w-5xl">
          <span className="split-me block">نحوّل الأفكار</span>
          <span className="split-me block">إلى <span className="grad-text text-glow">واقعٍ رقميٍ</span></span>
          <span className="split-me block">ذكي<span className="text-[#5fd4ff]">.</span></span>
        </h1>

        <p className="hero-fade lead max-w-2xl mt-8">
          نصمّم تجارب رقمية ثورية تدمج الذكاء الاصطناعي مع تصميم سينمائي عالمي —
          من فكرة على ورقة إلى منتج عالمي يُحدث فارقًا حقيقيًا في نمو عملك.
        </p>

        <div className="hero-fade flex flex-wrap items-center gap-4 mt-10">
          <a href={waLink("مرحبًا Amr AI، أريد بدء مشروع جديد.")} target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor-label="ابدأ الآن">
            ابدأ مشروعك
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M19 12H5m6-7l-7 7 7 7" /></svg>
          </a>
          <button onClick={() => scrollToId("services")} className="btn btn-ghost" data-cursor-label="اكتشف">
            شاهد كيف نعمل
            <svg className="w-4 h-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14m-7-7l7 7 7-7" /></svg>
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#14182866] rounded-2xl overflow-hidden border border-[#94b2ff14] max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat bg-[#06060dcc] backdrop-blur-md px-6 py-5">
              <div className="num-latin text-3xl font-bold text-white">
                <span className="num" data-value={s.value}>0</span><span className="text-[#5fd4ff]">{s.suffix}</span>
              </div>
              <div className="text-[13px] text-[#9aa5bc] font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* مؤشر التمرير */}
      <div className="hero-fade absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#5b6579]">
        <span className="text-[11px] font-bold tracking-[0.3em] latin">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#5fd4ff] to-transparent" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
