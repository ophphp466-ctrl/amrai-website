import { useEffect, useRef } from "react";
import gsap from "gsap";
import { splitLines } from "../lib/fx";

/* عنوان قسم موحد: kicker + عنوان ضخم يتكشف مع التمرير */
export function SectionHead({ kicker, title, sub, align = "start" }: { kicker: string; title: string; sub?: string; align?: "start" | "center" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleEl = ref.current!.querySelector<HTMLElement>(".split-me")!;
      const spans = splitLines(titleEl);
      gsap.to(spans, {
        y: 0, duration: 1, ease: "power4.out", stagger: 0.045,
        scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(ref.current!.querySelectorAll(".sh-fade"), { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none reverse" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={`mb-14 ${align === "center" ? "text-center" : ""}`}>
      <div className={`sh-fade kicker mb-4 ${align === "center" ? "justify-center" : ""}`}>{kicker}</div>
      <h2 className="display-2"><span className="split-me block">{title}</span></h2>
      {sub && <p className="sh-fade lead max-w-2xl mt-5" style={align === "center" ? { marginInline: "auto" } : undefined}>{sub}</p>}
    </div>
  );
}

/* شريط متحرك سينمائي */
export function Marquee({ items, reverse = false, className = "" }: { items: string[]; reverse?: boolean; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current!;
    const tween = gsap.to(track, {
      xPercent: reverse ? 50 : -50,
      ease: "none",
      duration: 28,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, [reverse]);
  const row = (
    <>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-6 px-6 shrink-0">
          <span className="text-2xl md:text-4xl font-black text-[#1b2138] group-hover:text-white transition-colors" style={{ WebkitTextStroke: "1px rgba(149,178,255,0.35)" }}>{it}</span>
          <svg className="w-5 h-5 text-[#29abe2]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
        </span>
      ))}
    </>
  );
  return (
    <div className={`overflow-hidden py-6 border-y border-[#94b2ff10] ${className}`} dir="ltr">
      <div ref={trackRef} className="marquee-track">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
