import { useEffect, useRef, useState } from "react";
import type { StoryDef } from "./types";

/* ═══ قصة الأتمتة: تدفق عمل حقيقي يعالج فواتير أمامك ═══ */

const code = `// تدفق أتمتة الفواتير — n8n workflow
{
  "name": "invoice-autopilot",
  "nodes": [
    { "type": "trigger", "on": "email.invoice_received" },
    { "type": "ai.extract",
      "model": "amr-vision-v3",
      "fields": ["vendor", "amount", "tax", "due_date"],
      "accuracy": 0.987 },
    { "type": "match",
      "against": "purchase_orders",
      "tolerance": 0.02 },
    { "type": "erp.post", "system": "accounting" },
    { "type": "notify", "channel": "whatsapp",
      "to": "finance-team" }
  ],
  "schedule": "24/7",
  "result": {
    "manual_time": "3 أيام",
    "automated_time": "4 ساعات",
    "errors": "-80%"
  }
}`;

type Stage = "idle" | number | "done";
const NODES = [
  { id: 0, label: "فاتورة واردة", icon: "📨", sub: "Email Trigger" },
  { id: 1, label: "استخراج AI", icon: "🧠", sub: "دقة 98.7%" },
  { id: 2, label: "مطابقة أمر الشراء", icon: "🔗", sub: "±2%" },
  { id: 3, label: "ترحيل للنظام", icon: "📒", sub: "ERP Post" },
  { id: 4, label: "إشعار واتساب", icon: "✅", sub: "تم في 4.2s" },
];

const MANUAL_MINUTES_PER_INVOICE = 35; // معالجة يدوية: ~35 دقيقة/فاتورة

function PipelineDemo() {
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [processed, setProcessed] = useState(0);
  const [log, setLog] = useState<string[]>(["التدفق جاهز — اضغط «شغّل» لبدء المعالجة."]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const pushLog = (s: string) => setLog((l) => [...l.slice(-5), s]);

  const runOne = () => {
    setRunning(true);
    NODES.forEach((n, i) => {
      timers.current.push(setTimeout(() => {
        setStage(n.id);
        pushLog(`[${new Date().toLocaleTimeString("ar-EG", { hour12: false })}] ${n.icon} ${n.label}… تم`);
      }, i * 750));
    });
    timers.current.push(setTimeout(() => {
      setStage("done");
      setProcessed((p) => p + 1);
      pushLog("✔ فاتورة #INV-20" + (48 + processed) + " رُحّلت بنجاح — 4.2 ثانية");
      setTimeout(() => { setStage("idle"); setRunning(false); }, 700);
    }, NODES.length * 750));
  };

  const savedMinutes = processed * MANUAL_MINUTES_PER_INVOICE;
  const savedHours = Math.floor(savedMinutes / 60);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* المؤشرات الحية */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="num-latin text-3xl font-bold text-[#ffd166]">{processed}</div>
          <div className="text-[11px] text-[#9aa5bc] font-bold mt-1">فاتورة مُعالجة</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="num-latin text-3xl font-bold text-[#ffd166]">{savedHours > 0 ? `${savedHours}س ${savedMinutes % 60}د` : `${savedMinutes}د`}</div>
          <div className="text-[11px] text-[#9aa5bc] font-bold mt-1">وقت يدوي وفّرته</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="num-latin text-3xl font-bold text-[#8ef0c9]">4.2s</div>
          <div className="text-[11px] text-[#9aa5bc] font-bold mt-1">زمن الفاتورة الواحدة</div>
        </div>
      </div>

      {/* خريطة التدفق */}
      <div className="glass rounded-2xl p-5" dir="ltr">
        <div className="flex items-center justify-between gap-1">
          {NODES.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1 flex-1">
              <div className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-500 min-w-[72px] flex-1
                ${stage === n.id ? "border-[#ffd166] bg-[#ffd166]/10 scale-110 shadow-[0_0_30px_rgba(255,209,102,0.3)]" : ""}
                ${typeof stage === "number" && stage > n.id || stage === "done" ? "border-[#8ef0c9]/60 bg-[#8ef0c9]/5" : ""}
                ${stage === "idle" || (typeof stage === "number" && stage < n.id) ? "border-[#94b2ff1f] opacity-60" : ""}`}>
                <span className="text-2xl">{n.icon}</span>
                <span className="text-[10px] font-bold text-white text-center leading-4" dir="rtl">{n.label}</span>
                <span className="text-[9px] mono text-[#7c8db0]">{n.sub}</span>
                {stage === n.id && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#ffd166]" style={{ animation: "pulse-glow .7s ease-in-out infinite" }} />}
              </div>
              {i < NODES.length - 1 && (
                <svg className="w-5 shrink-0 text-[#2a3355]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* السجل الحي */}
      <div className="terminal rounded-2xl p-4 flex-1 min-h-[110px] max-h-[150px] overflow-y-auto">
        {log.map((l, i) => (
          <div key={i} className={`${l.startsWith("✔") ? "term-line-ok" : l.startsWith("التدفق") ? "term-line-warn" : "term-line-info"}`}>{l}</div>
        ))}
        {running && <div className="term-line-cmd">▍</div>}
      </div>

      <button onClick={runOne} disabled={running} className="btn btn-primary self-start disabled:opacity-40 disabled:cursor-not-allowed">
        {running ? "جارٍ المعالجة…" : "شغّل فاتورة عبر التدفق ⚡"}
      </button>
    </div>
  );
}

export const automationStory: StoryDef = {
  lang: "json",
  file: "invoice-autopilot.json",
  code,
  Demo: PipelineDemo,
  narrative: {
    code: "تدفق عمل حقيقي بتعريف n8n: من وصول الفاتورة حتى إشعار الفريق — خمس عقد مترابطة.",
    build: "تم نشر التدفق على بيئة الإنتاج. النظام يعمل 24/7…",
    live: "شغّل فاتورة عبر التدفق وشاهدها تعبر العقد الخمس — العداد يحسب لك الوقت اليدوي الذي وفّرته فعلًا (35 دقيقة لكل فاتورة).",
  },
};
