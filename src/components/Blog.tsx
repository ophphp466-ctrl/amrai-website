import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ARTICLES, type Article } from "../lib/articles";
import { SectionHead } from "./Bits";
import { getLenis } from "../lib/scroll";

const CATS = ["الكل", "ذكاء اصطناعي", "تطوير ويب", "أتمتة", "تعلّم"];

/* قارئ المقال — ملء الشاشة بشريط تقدم قراءة */
export function ArticleReader({ article, onClose }: { article: Article; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    gsap.set(root.current, { visibility: "visible" });
    gsap.fromTo(root.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" });
    const scroller = root.current!;
    const onScroll = () => {
      const p = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight || 1);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      getLenis()?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    gsap.to(root.current, {
      clipPath: "inset(100% 0 0 0)", duration: 0.6, ease: "power4.inOut",
      onComplete: () => { gsap.set(root.current!, { visibility: "hidden" }); onClose(); },
    });
  };

  return (
    <div ref={root} className="fixed inset-0 z-[300] bg-[#04040c] overflow-y-auto" style={{ visibility: "hidden" }} role="dialog" aria-modal="true">
      <div className="fixed top-0 inset-x-0 h-1 z-10 bg-[#141828]" dir="ltr">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#29abe2] to-[#7b6cff]" style={{ boxShadow: "0 0 14px rgba(95,212,255,0.8)" }} />
      </div>

      <div className="shell max-w-3xl py-24">
        <button onClick={onClose} className="btn btn-ghost !py-2.5 !px-5 !text-sm mb-10">→ عودة للمدونة</button>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="chip" style={{ color: article.accent, borderColor: `${article.accent}55` }}>{article.category}</span>
          <span className="text-[13px] text-[#5b6579]">{article.date} · قراءة {article.readTime}</span>
        </div>
        <h1 className="display-3 !leading-[1.35] mb-10">{article.title}</h1>
        <div className="divider-glow mb-10" />
        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body }} />

        <div className="divider-glow my-12" />
        <div className="glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-black text-white">أعجبك المحتوى؟</div>
            <div className="text-sm text-[#9aa5bc]">هذا مستوى التفكير الذي نبني به مشاريع عملائنا.</div>
          </div>
          <a href="https://wa.me/201090991769?text=مرحبًا، قرأت مقالكم وأريد مناقشة مشروعي." target="_blank" rel="noreferrer" className="btn btn-primary !py-2.5 !text-sm">
            ناقش مشروعك معنا ←
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Blog({ onOpen }: { onOpen: (a: Article) => void }) {
  const root = useRef<HTMLElement>(null);
  const [cat, setCat] = useState("الكل");
  const list = cat === "الكل" ? ARTICLES : ARTICLES.filter((a) => a.category === cat);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".post-card", { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="blog" className="section bg-[#04040b]">
      <div className="shell">
        <SectionHead
          kicker="INSIGHTS · المدونة"
          title="أحدث المقالات والرؤى"
          sub="محتوى حقيقي بمصادر موثقة — نكتب ما نتقن، ونتحقق قبل أن ننشر."
        />

        <div className="flex flex-wrap gap-2 mb-10">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`chip !py-2 !px-5 !text-[13px] transition-all ${cat === c ? "!bg-[#29abe2] !text-[#02121e] !border-transparent" : "hover:!border-[#5fd4ff66]"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {list.map((a, i) => (
            <article key={a.id} onClick={() => onOpen(a)} data-cursor-label="اقرأ"
              role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpen(a)}
              className="post-card spot-card spot-border glass rounded-3xl overflow-hidden cursor-pointer group hover-lift">
              {/* غلاف مولّد بالكود */}
              <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, ${a.accent}18, #07070f 60%)` }}>
                <span className="absolute -bottom-7 left-4 num-latin text-[9rem] font-bold leading-none text-transparent transition-transform duration-700 group-hover:-translate-y-3"
                  style={{ WebkitTextStroke: `1.5px ${a.accent}40` }}>0{i + 1}</span>
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(${a.accent}55 1px, transparent 1px)`, backgroundSize: "22px 22px" }} />
                <span className="absolute top-4 right-4 chip !text-[11px]" style={{ color: a.accent, borderColor: `${a.accent}55`, background: "#04040ccc" }}>{a.category}</span>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-black text-white leading-9 group-hover:text-[#5fd4ff] transition-colors">{a.title}</h3>
                <p className="text-[13.5px] leading-7 text-[#9aa5bc] mt-3 line-clamp-2">{a.excerpt}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#94b2ff14] text-[12px] text-[#5b6579]">
                  <span>{a.date}</span>
                  <span className="flex items-center gap-2">قراءة {a.readTime}
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="#5fd4ff" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5m6-7l-7 7 7 7" /></svg>
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
