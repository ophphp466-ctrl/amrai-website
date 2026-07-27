import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { COMPANY, SERVICES, waLink } from "../lib/data";
import { SectionHead } from "./Bits";

/* التواصل — قنوات حقيقية + نموذج يرسل عبر واتساب فعلًا */
export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", phone: "", service: "", details: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-col", { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `مرحبًا Amr AI 👋\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالخدمة المطلوبة: ${form.service}\nتفاصيل المشروع:\n${form.details}`;
    window.open(waLink(msg), "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const cards = [
    { icon: "💬", title: "واتساب", value: COMPANY.whatsappDisplay, href: waLink("مرحبًا Amr AI 👋"), latin: true, note: "الأسرع — نرد خلال ساعات" },
    { icon: "✉️", title: "بريد إلكتروني", value: COMPANY.email, href: `mailto:${COMPANY.email}`, latin: true, note: "للعروض التفصيلية" },
    { icon: "📍", title: "المقر", value: COMPANY.hq, note: "نعمل مع العالم كله عن بُعد" },
    { icon: "🕘", title: "مواعيد العمل", value: COMPANY.hours, note: "استشارتك الأولى مجانية دائمًا" },
  ];

  return (
    <section ref={root} id="contact" className="section bg-[#04040b] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(800px 400px at 50% 100%, rgba(41,171,226,0.08), transparent 65%)" }} />
      <div className="shell relative">
        <SectionHead align="center"
          kicker="CONTACT · لنبدأ"
          title="تواصل معنا — لنبدأ قصة نجاحك"
          sub="استشارة مجانية · رد خلال 24 ساعة · عرض سعر ومقترح تقني كامل."
        />

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* القنوات */}
          <div className="contact-col grid sm:grid-cols-2 gap-4">
            {cards.map((c) => {
              const inner = (
                <>
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <div className="font-black text-white">{c.title}</div>
                    <div className={`text-[13.5px] font-bold text-[#5fd4ff] mt-1 ${c.latin ? "num-latin" : ""}`} dir={c.latin ? "ltr" : "rtl"}>{c.value}</div>
                    <div className="text-[11.5px] text-[#5b6579] mt-1">{c.note}</div>
                  </div>
                </>
              );
              return c.href ? (
                <a key={c.title} href={c.href} target="_blank" rel="noreferrer" className="spot-card glass rounded-2xl p-5 flex gap-4 items-start hover-lift">{inner}</a>
              ) : (
                <div key={c.title} className="glass rounded-2xl p-5 flex gap-4 items-start">{inner}</div>
              );
            })}
            <div className="sm:col-span-2 rounded-2xl p-[1px] bg-gradient-to-l from-[#29abe2] via-[#7b6cff] to-[#29abe2]">
              <div className="rounded-2xl bg-[#07070f] p-6 text-center">
                <div className="text-lg font-black text-white">لست متأكدًا من أين تبدأ؟</div>
                <p className="text-[13px] text-[#9aa5bc] mt-1.5 mb-4">احجز مكالمة اكتشاف مجانية 20 دقيقة — نسمع فكرتك ونرسم لك الطريق.</p>
                <a href={waLink("مرحبًا Amr AI، أريد حجز مكالمة اكتشاف مجانية (20 دقيقة).")} target="_blank" rel="noreferrer" className="btn btn-primary !text-sm">احجز مكالمتك المجانية ⚡</a>
              </div>
            </div>
          </div>

          {/* النموذج */}
          <form onSubmit={submit} className="contact-col glass rounded-3xl p-7 md:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-black text-[#c3cddf] mb-2">الاسم الكامل *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="اسمك الكريم" />
              </div>
              <div>
                <label className="block text-[12.5px] font-black text-[#c3cddf] mb-2">رقم الهاتف *</label>
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field num-latin" dir="ltr" placeholder="01xxxxxxxxx" />
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] font-black text-[#c3cddf] mb-2">الخدمة المطلوبة *</label>
              <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="field">
                <option value="" disabled>اختر الخدمة…</option>
                {SERVICES.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                <option value="أخرى">أخرى / لست متأكدًا بعد</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-black text-[#c3cddf] mb-2">تفاصيل المشروع *</label>
              <textarea required rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="field resize-none" placeholder="اكتب لنا فكرتك أو احتياجك…" />
            </div>
            <button type="submit" className="btn btn-primary w-full !py-4">
              {sent ? "✓ فُتح واتساب — أكمل الإرسال من هناك" : "إرسال عبر واتساب مباشرة ⚡"}
            </button>
            <p className="text-[11.5px] text-[#5b6579] text-center leading-6">
              يفتح الزر واتساب برسالتك جاهزة — تصلنا فورًا ونرد خلال 24 ساعة.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
