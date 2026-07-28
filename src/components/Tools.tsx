import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { CALC, READINESS, waLink } from "../lib/data";
import { SectionHead } from "./Bits";

/* ── حاسبة التكلفة الحقيقية ── */
function Calculator() {
  const [service, setService] = useState(CALC.services[0].id);
  const [complexity, setComplexity] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [rush, setRush] = useState(false);

  const { low, high } = useMemo(() => {
    const base = CALC.services.find((s) => s.id === service)!.base;
    const mult = CALC.complexity.find((c) => c.id === complexity)!.mult;
    const extraSum = extras.reduce((s, id) => s + CALC.extras.find((e) => e.id === id)!.price, 0);
    let total = base * mult + extraSum;
    if (rush) total *= CALC.rushMult;
    return { low: Math.round(total * 0.9), high: Math.round(total * 1.1) };
  }, [service, complexity, extras, rush]);

  const fmt = (n: number) => n.toLocaleString("en-US");
  const svcLabel = CALC.services.find((s) => s.id === service)!.label;

  return (
    <div className="glass rounded-3xl p-7 md:p-9 spot-card">
      <div className="flex items-center gap-3 mb-7">
        <span className="text-3xl">🧮</span>
        <div>
          <h3 className="text-2xl font-black text-white">حاسبة تكلفة المشروع</h3>
          <p className="text-sm text-[#9aa5bc]">تقدير فوري مبني على جدول أسعارنا الرسمي</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm font-black text-[#c3cddf] mb-3">نوع المشروع</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CALC.services.map((s) => (
              <button key={s.id} onClick={() => setService(s.id)}
                className={`rounded-xl px-3 py-2.5 text-[13px] font-bold border transition-all ${service === s.id ? "bg-[#29abe2] text-[#02121e] border-transparent shadow-[0_0_20px_rgba(41,171,226,0.4)]" : "border-[#94b2ff1f] text-[#9aa5bc] hover:border-[#5fd4ff66]"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-black text-[#c3cddf] mb-3">مستوى التعقيد</div>
          <div className="space-y-2">
            {CALC.complexity.map((c) => (
              <button key={c.id} onClick={() => setComplexity(c.id)}
                className={`w-full text-right rounded-xl px-4 py-3 text-[13px] font-bold border transition-all flex justify-between items-center ${complexity === c.id ? "border-[#5fd4ff] bg-[#5fd4ff]/10 text-white" : "border-[#94b2ff1f] text-[#9aa5bc] hover:border-[#5fd4ff55]"}`}>
                {c.label}
                <span className="num-latin text-[11px] opacity-70">×{c.mult}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-black text-[#c3cddf] mb-3">إضافات اختيارية</div>
          <div className="flex flex-wrap gap-2">
            {CALC.extras.map((e) => {
              const on = extras.includes(e.id);
              return (
                <button key={e.id} onClick={() => setExtras((x) => on ? x.filter((i) => i !== e.id) : [...x, e.id])}
                  className={`chip !text-[12px] !py-2 transition-all ${on ? "!bg-[#7b6cff] !text-white !border-transparent shadow-[0_0_16px_rgba(123,108,255,0.45)]" : "hover:!border-[#7b6cff88]"}`}>
                  {on ? "✓ " : "+ "}{e.label} <span className="num-latin opacity-75">${e.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button onClick={() => setRush(!rush)} className={`w-12 h-6.5 h-7 rounded-full transition-all relative ${rush ? "bg-[#ffd166]" : "bg-[#1b2440]"}`} aria-pressed={rush}>
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${rush ? "right-6" : "right-1"}`} />
          </button>
          <span className="text-[13px] font-bold text-[#c3cddf]">تنفيذ مستعجل <span className="text-[#ffd166]">(+25%)</span></span>
        </label>

        <div className="rounded-2xl border border-[#5fd4ff33] bg-gradient-to-l from-[#29abe2]/10 to-transparent p-6 text-center">
          <div className="text-[12px] font-bold text-[#9aa5bc] mb-1.5">التكلفة التقديرية لمشروعك</div>
          <div className="num-latin text-4xl md:text-5xl font-bold text-white">
            ${fmt(low)} <span className="text-[#5fd4ff] text-2xl">—</span> ${fmt(high)}
          </div>
          <div className="text-[11px] text-[#5b6579] mt-2">تقدير مبدئي ±10% — السعر النهائي يُثبَّت بعد الاستشارة المجانية</div>
          <a href={waLink(`مرحبًا Amr AI، استخدمت حاسبة التكلفة: ${svcLabel} — تعقيد ${CALC.complexity.find((c) => c.id === complexity)!.label}${extras.length ? ` — إضافات: ${extras.map((id) => CALC.extras.find((e) => e.id === id)!.label).join("، ")}` : ""}${rush ? " — مستعجل" : ""} — التقدير $${fmt(low)}–$${fmt(high)}. أريد عرض سعر دقيقًا.`)}
            target="_blank" rel="noreferrer" className="btn btn-primary mt-5 !text-sm">
            احصل على عرض سعر دقيق ←
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── اختبار الجاهزية الرقمية ── */
function Readiness() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = answers.length === READINESS.questions.length;
  const score = answers.reduce((a, b) => a + b, 0);
  const tier = READINESS.tiers.find((t) => score <= t.max)!;

  const answer = (s: number) => {
    setAnswers((a) => [...a, s]);
    setStep((x) => x + 1);
  };
  const reset = () => { setAnswers([]); setStep(0); };

  return (
    <div className="glass rounded-3xl p-7 md:p-9 spot-card">
      <div className="flex items-center gap-3 mb-7">
        <span className="text-3xl">🧭</span>
        <div>
          <h3 className="text-2xl font-black text-white">اختبار الجاهزية الرقمية</h3>
          <p className="text-sm text-[#9aa5bc]">أربعة أسئلة — وتعرف بالضبط من أين تبدأ</p>
        </div>
      </div>

      {!done ? (
        <div key={step}>
          <div className="flex items-center gap-2 mb-6">
            {READINESS.questions.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < answers.length ? "bg-[#5fd4ff]" : i === answers.length ? "bg-[#5fd4ff66]" : "bg-[#1b2440]"}`} />
            ))}
          </div>
          <div className="text-[13px] font-bold text-[#5fd4ff] mb-2">سؤال {step + 1} من {READINESS.questions.length}</div>
          <div className="text-xl font-black text-white mb-6 leading-9">{READINESS.questions[step].q}</div>
          <div className="space-y-2.5" style={{ animation: "rise .5s cubic-bezier(.16,1,.3,1) both" }}>
            <style>{`@keyframes rise { from { opacity: 0; transform: translateY(18px); } }`}</style>
            {READINESS.questions[step].options.map((o) => (
              <button key={o.t} onClick={() => answer(o.s)}
                className="w-full text-right rounded-xl border border-[#94b2ff1f] px-5 py-4 text-[14.5px] font-bold text-[#c3cddf] hover:border-[#5fd4ff] hover:bg-[#5fd4ff]/8 hover:text-white transition-all">
                {o.t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: "rise .6s cubic-bezier(.16,1,.3,1) both" }}>
          <style>{`@keyframes rise { from { opacity: 0; transform: translateY(18px); } }`}</style>
          <div className="text-center mb-6">
            <div className="num-latin inline-flex items-end gap-1 text-6xl font-bold text-[#5fd4ff]">
              {score}<span className="text-2xl text-[#5b6579]">/8</span>
            </div>
            <div className="text-lg font-black text-white mt-2">{tier.title}</div>
          </div>
          <p className="text-[14.5px] leading-8 text-[#c3cddf] bg-[#080a16] border border-[#94b2ff14] rounded-2xl p-5">{tier.text}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={waLink(`مرحبًا Amr AI، نتيجة اختبار الجاهزية الرقمية: ${score}/8 — «${tier.title}». أريد خطة عمل.`)}
              target="_blank" rel="noreferrer" className="btn btn-primary !text-sm">{tier.cta} ←</a>
            <button onClick={reset} className="btn btn-ghost !text-sm">↻ أعد الاختبار</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tools() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".tool-card", { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="tools" className="section">
      <div className="shell">
        <SectionHead
          kicker="FREE TOOLS · أدوات مجانية"
          title="ابدأ بأدوات احترافية مجانًا"
          sub="أدوات حقيقية تعمل بالكامل الآن — تساعدك على تحليل مشروعك وتخطيطه قبل أن نتحدث."
        />
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="tool-card"><Calculator /></div>
          <div className="tool-card"><Readiness /></div>
        </div>
      </div>
    </section>
  );
}
