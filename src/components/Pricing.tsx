import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PRICING, waLink } from "../lib/data";
import { SectionHead } from "./Bits";

/* الأسعار الرسمية — من جدول الشركة المعتمد */
export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".price-row", { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="pricing" className="section">
      <div className="shell">
        <SectionHead
          kicker="PRICING · شفافية كاملة"
          title="أسعار واضحة، بلا مفاجآت"
          sub="جدولنا الرسمي المعتمد — يبدأ منه كل مشروع، ويُثبَّت السعر النهائي بعد الاستشارة المجانية. لا رسوم خفية أبدًا."
        />

        <div className="glass rounded-3xl overflow-hidden">
          {/* رأس الجدول */}
          <div className="hidden md:grid grid-cols-[1.3fr,1.4fr,0.8fr,0.8fr,0.9fr] gap-4 px-8 py-5 border-b border-[#94b2ff14] text-[12px] font-black tracking-wide text-[#5b6579]">
            <span>الخدمة</span><span>التقنيات المستخدمة</span><span>المدة المتوقعة</span><span>يبدأ من</span><span></span>
          </div>
          {PRICING.map((p) => (
            <div key={p.service} className="price-row grid md:grid-cols-[1.3fr,1.4fr,0.8fr,0.8fr,0.9fr] gap-3 md:gap-4 items-center px-6 md:px-8 py-5 border-b border-[#94b2ff0d] hover:bg-[#5fd4ff08] transition-colors group">
              <div className="font-black text-white text-[15.5px]">{p.service}</div>
              <div className="latin text-[12.5px] text-[#7c8db0]" dir="ltr" style={{ textAlign: "right" }}>{p.tech}</div>
              <div className="text-[13px] font-bold text-[#9aa5bc]">{p.duration}</div>
              <div className="num-latin text-xl font-bold text-[#5fd4ff]">${p.from.toLocaleString()}</div>
              <div>
                <a href={waLink(`مرحبًا Amr AI، أريد عرض سعر لخدمة «${p.service}».`)} target="_blank" rel="noreferrer"
                  className="btn btn-ghost !py-2 !px-4 !text-[12.5px] group-hover:!border-[#5fd4ff88] w-full md:w-auto justify-center">
                  اطلب عرضًا ←
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[13px] text-[#5b6579] mt-6 leading-7">
          كل مشروع يشمل: استشارة مجانية · مقترحًا تقنيًا مفصلًا · عرض سعر نهائيًا — كل ذلك خلال 24 ساعة من تواصلك.
        </p>
      </div>
    </section>
  );
}
