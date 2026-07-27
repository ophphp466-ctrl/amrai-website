import { useState } from "react";
import type { StoryDef } from "./types";

/* ═══ قصة الاستشارات: من التحليل إلى خارطة طريق تفاعلية ═══ */

const code = `# تحليل الوضع الرقمي — عميل قطاع تجزئة
from amrai.audit import DigitalAudit

audit = DigitalAudit(client="retail-group-eg")

report = audit.run(
    systems=["erp", "pos", "website", "excel-sheets"],
    interviews=14,          # مقابلة مع الفرق
    data_window="18 شهرًا",
)

print(report.maturity)       # 2.1 / 5 — مرحلة مبكرة
print(report.quick_wins)
# → أتمتة المخزون: توفير 22 ساعة/أسبوع
# → ربط نقاط البيع بالمخزون: -31% فاقد
# → لوحة مؤشرات مبيعات لحظية

roadmap = report.build_roadmap(horizon="12 شهرًا")
roadmap.export("خارطة-الطريق-2026.pdf")
print(f"العائد المتوقع: {roadmap.roi:.0f}% خلال عام")
# العائد المتوقع: 240% خلال عام`;

const PHASES = [
  {
    id: 1, title: "التشخيص والتدقيق", period: "أسبوع 1–2", icon: "🔍",
    points: ["تدقيق 14 نظامًا وعملية", "مقابلات مع الفرق التشغيلية", "قياس النضج الرقمي: 2.1/5"],
    roi: 0,
  },
  {
    id: 2, title: "الانتصارات السريعة", period: "أسبوع 3–8", icon: "⚡",
    points: ["أتمتة جرد المخزون — توفير 22 ساعة أسبوعيًا", "ربط نقاط البيع بالمخزون مباشرة", "خفض الفاقد 31% خلال أول شهر"],
    roi: 60,
  },
  {
    id: 3, title: "المنصة والبيانات", period: "شهر 3–8", icon: "🏗️",
    points: ["لوحة مؤشرات مبيعات لحظية للإدارة", "توحيد مصادر البيانات في مستودع واحد", "تدريب الفريق على القرار بالبيانات"],
    roi: 140,
  },
  {
    id: 4, title: "الذكاء الاصطناعي", period: "شهر 9–12", icon: "🧠",
    points: ["تنبؤ بالطلب على الأصناف بدقة 92%", "توصيات تسعير ديناميكية", "عائد تراكمي مستهدف 240%"],
    roi: 240,
  },
];

function RoadmapDemo() {
  const [active, setActive] = useState(1);
  const phase = PHASES.find((p) => p.id === active)!;

  return (
    <div className="h-full flex flex-col gap-5">
      {/* الخط الزمني */}
      <div className="relative">
        <div className="absolute top-6 inset-x-8 h-px bg-[#1b2440]" />
        <div className="absolute top-6 right-8 h-px bg-gradient-to-l from-[#5fd4ff] to-[#7b6cff] transition-all duration-700"
          style={{ width: `${((active - 1) / (PHASES.length - 1)) * 82}%`, boxShadow: "0 0 12px rgba(95,212,255,0.7)" }} />
        <div className="relative flex justify-between">
          {PHASES.map((p) => (
            <button key={p.id} onClick={() => setActive(p.id)} className="flex flex-col items-center gap-2 group" data-cursor>
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all duration-400
                ${active >= p.id ? "bg-gradient-to-br from-[#29abe2] to-[#7b6cff] border-transparent shadow-[0_0_24px_rgba(41,171,226,0.5)]" : "bg-[#0b0f1f] border-[#94b2ff1f] group-hover:border-[#5fd4ff]/50"}
                ${active === p.id ? "scale-110" : ""}`}>
                {p.icon}
              </span>
              <span className={`text-[10.5px] font-bold transition-colors ${active === p.id ? "text-[#5fd4ff]" : "text-[#5b6579]"}`}>{p.period}</span>
            </button>
          ))}
        </div>
      </div>

      {/* تفاصيل المرحلة */}
      <div key={active} className="glass rounded-2xl p-5 flex-1" style={{ animation: "rise .55s cubic-bezier(.16,1,.3,1) both" }}>
        <style>{`@keyframes rise { from { opacity: 0; transform: translateY(20px); } }`}</style>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-black text-white">{phase.icon} {phase.title}</h4>
          <span className="chip">{phase.period}</span>
        </div>
        <ul className="space-y-2.5">
          {phase.points.map((pt) => (
            <li key={pt} className="flex items-start gap-2.5 text-[13.5px] leading-7 text-[#c3cddf]">
              <svg className="w-4 h-4 mt-1.5 shrink-0 text-[#5fd4ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              {pt}
            </li>
          ))}
        </ul>
        {phase.roi > 0 && (
          <div className="mt-5">
            <div className="flex justify-between text-[11px] font-bold text-[#9aa5bc] mb-1.5">
              <span>العائد التراكمي المتوقع</span>
              <span className="num-latin text-[#8ef0c9] text-sm font-black">+{phase.roi}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#141828] overflow-hidden" dir="ltr">
              <div className="h-full rounded-full bg-gradient-to-r from-[#29abe2] to-[#8ef0c9] transition-all duration-1000" style={{ width: `${(phase.roi / 240) * 100}%`, boxShadow: "0 0 14px rgba(142,240,201,0.6)" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const consultingStory: StoryDef = {
  lang: "python",
  file: "digital_audit.py",
  code,
  Demo: RoadmapDemo,
  narrative: {
    code: "هكذا يبدأ كل مشروع استشاري: تدقيق رقمي شامل يقيس النضج ويكشف الانتصارات السريعة بالأرقام.",
    build: "اكتمل التحليل — نرسم خارطة الطريق الآن…",
    live: "خارطة طريق تفاعلية حقيقية لعميل تجزئة: اضغط أي مرحلة لترى مخرجاتها والعائد التراكمي المتوقع حتى 240%.",
  },
};
