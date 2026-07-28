import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, type Service } from "../lib/data";
import { SectionHead } from "./Bits";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   AMR AI — Services
   Clean reveal, no clutter. Each service a precise node.
   ═══════════════════════════════════════════════════════════ */

export default function Services({ onOpenStory }: { onOpenStory: (s: Service) => void }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards reveal from below with stagger
      gsap.fromTo(".svc-card", 
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".svc-grid", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="services" className="section relative">
      {/* Subtle side glow */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(41,171,226,0.08), transparent)" }} />

      <div className="shell relative">
        <SectionHead
          kicker="SERVICES"
          title="ماذا نقدم"
          sub="ست قدرات أساسية — كل واحدة تفتح قصة تفاعلية حية."
        />

        <div className="svc-grid grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <article
              key={s.id}
              className="svc-card group cursor-pointer"
              onClick={() => onOpenStory(s)}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onOpenStory(s)}
            >
              <div className="glass rounded-2xl p-8 border border-[#94b2ff10] hover:border-[#94b2ff25] transition-all duration-700 hover:bg-[#0a0e1a]">
                {/* Number + Icon */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl font-black text-transparent" style={{ WebkitTextStroke: "1px rgba(149,178,255,0.2)" }}>
                    {s.index}
                  </span>
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#94b2ff15]"
                    style={{ background: `${s.accent}08` }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="1.5" strokeLinecap="round">
                      <path d={s.icon} />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#5fd4ff] transition-colors duration-500">
                  {s.title}
                </h3>
                
                <p className="text-[14px] leading-7 text-[#9aa5bc] mb-6">
                  {s.desc}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {s.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#c3cddf]">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: s.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-4 border-t border-[#94b2ff10] flex items-center justify-between">
                  <div className="flex gap-2">
                    {s.tech.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-bold text-[#5b6579] px-2 py-1 rounded-full border border-[#94b2ff10]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#5fd4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-1">
                    شغّل القصة →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
