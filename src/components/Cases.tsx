import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CASES } from "../lib/data";
import { SectionHead } from "./Bits";

/* سلايدر قبل/بعد — تفاعلي حقيقي بالسحب */
function BeforeAfter() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    let dragging = false;
    const setPos = (clientX: number) => {
      const r = el.getBoundingClientRect();
      const p = Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100));
      el.style.setProperty("--ba", `${p}%`);
    };
    const down = (e: PointerEvent) => { dragging = true; el.setPointerCapture(e.pointerId); setPos(e.clientX); };
    const move = (e: PointerEvent) => dragging && setPos(e.clientX);
    const up = () => { dragging = false; };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => { el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
  }, []);

  return (
    <div ref={wrap} className="ba-wrap aspect-[16/8] cursor-ew-resize" data-cursor-label="اسحب">
      {/* قبل — تصميم قديم */}
      <div className="absolute inset-0 bg-[#c8c8c8] p-[4%]" dir="ltr">
        <div className="h-full bg-[#e8e8e8] border-4 border-[#999] p-4 font-mono text-[#333]">
          <div className="bg-[#000080] text-white px-3 py-2 text-sm font-bold flex justify-between">
            <span>My Store 2009</span><span>Home | Products | Guestbook</span>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-1/4 bg-[#ddd] border-2 border-[#aaa] p-2 text-[10px] leading-4">
              ☑ Categories<br />□ Sale!<br />□ Links<br />□ Counter: 01438
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold underline">Welcome To Our Website!!</div>
              <p className="text-[11px] mt-2 leading-5">Best products online!!! We sell many items. Click here to buy. Page best viewed in Internet Explorer 6.0 at 800x600.</p>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3].map((i) => <div key={i} className="w-16 h-12 bg-[#bbb] border-2 border-[#888] flex items-center justify-center text-[9px]">IMG</div>)}
              </div>
              <button className="mt-3 px-3 py-1 bg-[#ccc] border-2 border-[#666] text-[11px]" style={{ boxShadow: "2px 2px 0 #555" }}>BUY NOW</button>
            </div>
          </div>
          <div className="mt-4 text-center text-[9px] text-[#777]">© 2009 — visitor counter — sign our guestbook</div>
        </div>
        <span className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full" dir="rtl">قبل 😴</span>
      </div>

      {/* بعد — تصميم Amr AI */}
      <div className="ba-after bg-[#05050d] p-[4%]" dir="ltr">
        <div className="h-full rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center"
          style={{ background: "radial-gradient(600px 300px at 50% 0%, #123, #05050d)" }}>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(95,212,255,0.25) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="relative">
            <div className="latin text-[10px] tracking-[0.5em] text-[#5fd4ff] mb-3">AMR AI · CINEMATIC BUILD</div>
            <div className="text-3xl md:text-5xl font-black text-white leading-tight" dir="rtl">تجربة تبيع قبل أن تتحدث</div>
            <div className="mt-4 flex justify-center gap-3">
              <span className="px-5 py-2 rounded-full bg-gradient-to-l from-[#29abe2] to-[#5fd4ff] text-[#02121e] text-sm font-black">اطلب الآن ⚡</span>
              <span className="px-5 py-2 rounded-full border border-[#5fd4ff44] text-white text-sm font-bold">شاهد المزيد</span>
            </div>
            <div className="mt-5 flex justify-center gap-6 text-[11px] text-[#9aa5bc]" dir="rtl">
              <span>⚡ 0.8s تحميل</span><span>🎯 100/100</span><span>📱 متجاوب كليًا</span>
            </div>
          </div>
        </div>
        <span className="absolute top-4 right-4 bg-[#29abe2] text-[#02121e] text-xs font-black px-3 py-1.5 rounded-full" dir="rtl">بعد 🚀</span>
      </div>

      <div className="ba-handle"><div className="ba-knob">⇄</div></div>
    </div>
  );
}

/* قصص النجاح */
export default function Cases() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ba-block", { opacity: 0, y: 50, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".ba-block", start: "top 78%", toggleActions: "play none none reverse" },
      });
      gsap.utils.toArray<HTMLElement>(".case-row").forEach((row, i) => {
        gsap.fromTo(row, { opacity: 0, x: i % 2 ? -70 : 70 }, {
          opacity: 1, x: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 80%", toggleActions: "play none none reverse" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="section bg-[#04040b]">
      <div className="shell">
        <SectionHead
          kicker="SUCCESS STORIES · قصص نجاح"
          title="مشاريع صنعت الفارق"
          sub="أربع قصص من أكثر من 500 مشروع ناجح — واسحب المقبض لترى الفرق الحقيقي الذي نصنعه بين «قبل» و«بعد»."
        />

        <div className="ba-block mb-20">
          <BeforeAfter />
        </div>

        <div className="space-y-6">
          {CASES.map((c, i) => (
            <article key={c.id} className={`case-row glass rounded-3xl p-8 md:p-10 grid md:grid-cols-[1.1fr,1fr] gap-8 items-center hover-lift ${i % 2 ? "md:[direction:ltr]" : ""}`}>
              <div className="[direction:rtl]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="chip" style={{ color: c.accent, borderColor: `${c.accent}44` }}>{c.field}</span>
                  <span className="num-latin text-3xl font-bold text-transparent" style={{ WebkitTextStroke: "1px rgba(149,178,255,0.3)" }}>0{i + 1}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">{c.title}</h3>
                <p className="lead !text-[15px] mt-3">{c.desc}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 [direction:rtl]">
                {c.metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl border border-[#94b2ff14] bg-[#080a16] p-4 text-center">
                    <div className="text-xl md:text-2xl font-black" style={{ color: c.accent }}>{m.value}</div>
                    <div className="text-[11px] text-[#9aa5bc] font-bold mt-1.5 leading-5">{m.label}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
