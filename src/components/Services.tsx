import { useEffect, useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, type Service } from "../lib/data";
import { SectionHead } from "./Bits";

const NeuralNetwork3D = lazy(() => import("./NeuralNetwork3D"));

/* ═══════════════════════════════════════════════════════════
   AMR AI — Services with 3D Neural Network
   Cinematic scroll experience with interactive 3D nodes
   ═══════════════════════════════════════════════════════════ */

export default function Services({ onOpenStory }: { onOpenStory: (s: Service) => void }) {
  const root = useRef<HTMLElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Network reveal
      gsap.fromTo(networkRef.current, 
        { opacity: 0, scale: 0.92 }, 
        {
          opacity: 1, scale: 1, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: networkRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Cards stagger reveal
      gsap.fromTo(".svc-card", { opacity: 0, y: 60, rotateX: -8 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-grid", start: "top 75%", toggleActions: "play none none reverse" },
      });

      // Section head
      gsap.fromTo(".svc-head", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-head", start: "top 85%", toggleActions: "play none none reverse" },
      });
    }, root);

    // 3D tilt on cards
    const cards = root.current!.querySelectorAll<HTMLElement>(".svc-card");
    const handlers: [HTMLElement, (e: PointerEvent) => void, () => void][] = [];
    cards.forEach((card) => {
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        card.style.setProperty("--mx", `${px}px`);
        card.style.setProperty("--my", `${py}px`);
        const rx = ((py / r.height) - 0.5) * -8;
        const ry = ((px / r.width) - 0.5) * 8;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 1200, duration: 0.4, ease: "power2.out" });
      };
      const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      handlers.push([card, move, leave]);
    });

    return () => {
      ctx.revert();
      handlers.forEach(([c, m, l]) => { c.removeEventListener("pointermove", m); c.removeEventListener("pointerleave", l); });
    };
  }, []);

  return (
    <section ref={root} id="services" className="section relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(41,171,226,0.04), transparent)" }} />

      <div className="shell relative">
        <div className="svc-head">
          <SectionHead
            kicker="SERVICES · ماذا نقدم"
            title="شبكة قدراتنا التقنية"
            sub="ست قدرات متصلة — كل خدمة عقدة في شبكتنا العصبية، تتفاعل مع بقية الخدمات لتُنتج حلولًا متكاملة."
          />
        </div>

        {/* 3D Neural Network */}
        <div ref={networkRef} className="mb-16">
          <Suspense fallback={
            <div className="w-full h-[55vh] md:h-[75vh] rounded-3xl glass flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#29abe2] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#5b6579]">جاري تحميل التجربة الثلاثية الأبعاد…</span>
              </div>
            </div>
          }>
            <NeuralNetwork3D services={SERVICES} />
          </Suspense>
        </div>

        {/* Service Cards Grid */}
        <div className="svc-grid grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <article
              key={s.id}
              className="svc-card spot-card spot-border glass rounded-3xl p-7 flex flex-col gap-5 cursor-pointer will-change-transform group"
              onClick={() => onOpenStory(s)}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onOpenStory(s)}
              data-cursor-label="شغّل القصة"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#94b2ff1f] bg-[#0b0f1f]"
                  style={{ boxShadow: `0 0 30px ${s.accent}22` }}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
                <span className="num-latin text-5xl font-bold text-transparent" style={{ WebkitTextStroke: "1.2px rgba(149,178,255,0.28)" }}>{s.index}</span>
              </div>

              <div>
                <div className="latin text-[11px] tracking-[0.3em] uppercase mb-1.5" style={{ color: s.accent }}>{s.latin}</div>
                <h3 className="text-2xl font-black text-white">{s.title}</h3>
                <p className="text-[15px] leading-8 text-[#9aa5bc] mt-2.5">{s.desc}</p>
              </div>

              <ul className="space-y-2 text-[13.5px] text-[#c3cddf]">
                {s.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-[#94b2ff14] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {s.tech.slice(0, 3).map((t) => <span key={t} className="chip !text-[11px] !py-1">{t}</span>)}
                </div>
                <span className="flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3.5" style={{ color: s.accent }}>
                  شغّل القصة
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5m6-7l-7 7 7 7" /></svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
