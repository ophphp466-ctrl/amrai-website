import { useEffect, useRef, useState } from "react";
import type { StoryDef } from "./types";

/* ═══ قصة السحابة: نشر حي ثم لوحة مؤشرات لحظية ═══ */

const code = `# deploy.sh — خط أنابيب النشر الكامل
#!/usr/bin/env bash
set -euo pipefail

echo "▶ بناء الحاوية…"
docker build -t amrai/platform:2.4.1 .

echo "▶ فحص أمني للصورة…"
trivy image --severity HIGH,CRITICAL amrai/platform:2.4.1

echo "▶ رفع إلى السجل…"
docker push registry.amr-ai.com/platform:2.4.1

echo "▶ نشر تدريجي على Kubernetes…"
kubectl set image deployment/platform \\
  app=registry.amr-ai.com/platform:2.4.1 \\
  --namespace=production
kubectl rollout status deployment/platform -n production

echo "▶ التحقق من الصحة…"
kubectl wait --for=condition=ready pod \\
  -l app=platform --timeout=120s

echo "✓ النشر اكتمل — صفر توقف 🚀"`;

const DEPLOY_LOG: { t: string; c: string }[] = [
  { t: "$ ./deploy.sh", c: "cmd" },
  { t: "▶ بناء الحاوية…", c: "info" },
  { t: "  [████████████████████] 100%  ·  38.2s", c: "ok" },
  { t: "▶ فحص تريفي: 0 ثغرات حرجة ✓", c: "ok" },
  { t: "▶ رفع الصورة → registry.amr-ai.com", c: "info" },
  { t: "▶ نشر تدريجي: 2/6 pods … 4/6 … 6/6 ✓", c: "ok" },
  { t: "▶ فحص الصحة: كل الخدمات جاهزة ✓", c: "ok" },
  { t: "✓ الإصدار 2.4.1 يعمل على الإنتاج — صفر توقف", c: "ok" },
];

function CloudDemo() {
  const [logLines, setLogLines] = useState<typeof DEPLOY_LOG>([]);
  const [done, setDone] = useState(false);
  const [metrics, setMetrics] = useState({ cpu: 34, mem: 61, rps: 1284, lat: 42 });
  const termRef = useRef<HTMLDivElement>(null);

  // بث سجل النشر
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setLogLines((l) => [...l, DEPLOY_LOG[i]]);
      i++;
      if (i >= DEPLOY_LOG.length) { clearInterval(iv); setDone(true); }
    }, 550);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { termRef.current?.scrollTo({ top: 99999 }); }, [logLines]);

  // مؤشرات لحظية
  useEffect(() => {
    if (!done) return;
    const iv = setInterval(() => {
      setMetrics((m) => ({
        cpu: Math.max(18, Math.min(78, m.cpu + (Math.random() - 0.5) * 14)),
        mem: Math.max(40, Math.min(82, m.mem + (Math.random() - 0.5) * 8)),
        rps: Math.max(800, Math.min(2200, m.rps + (Math.random() - 0.5) * 260)),
        lat: Math.max(28, Math.min(90, m.lat + (Math.random() - 0.5) * 16)),
      }));
    }, 900);
    return () => clearInterval(iv);
  }, [done]);

  const Gauge = ({ label, value, unit, max, color }: { label: string; value: number; unit: string; max: number; color: string }) => (
    <div className="glass rounded-2xl p-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[11px] font-bold text-[#9aa5bc]">{label}</span>
        <span className="num-latin text-lg font-bold" style={{ color }}>{Math.round(value)}{unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#141828] overflow-hidden" dir="ltr">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-4">
      <div ref={termRef} className="terminal p-4 max-h-[210px] overflow-y-auto">
        {logLines.map((l, i) => (
          <div key={i} className={l.c === "cmd" ? "term-line-cmd" : l.c === "ok" ? "term-line-ok" : "term-line-info"}>{l.t}</div>
        ))}
        {!done && <div className="term-line-cmd">▍</div>}
      </div>

      {done && (
        <div className="grid grid-cols-2 gap-3" style={{ animation: "rise .8s cubic-bezier(.16,1,.3,1) both" }}>
          <style>{`@keyframes rise { from { opacity: 0; transform: translateY(24px); } }`}</style>
          <Gauge label="المعالج CPU" value={metrics.cpu} unit="%" max={100} color="#5fd4ff" />
          <Gauge label="الذاكرة RAM" value={metrics.mem} unit="%" max={100} color="#7b6cff" />
          <Gauge label="طلب/ثانية" value={metrics.rps} unit="" max={2400} color="#8ef0c9" />
          <Gauge label="زمن الاستجابة" value={metrics.lat} unit="ms" max={150} color="#ffd166" />
          <div className="col-span-2 glass rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#9aa5bc]">الحالة العامة</span>
            <span className="flex items-center gap-2 text-[13px] font-black text-[#8ef0c9]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8ef0c9]" style={{ animation: "pulse-glow 1.6s ease-in-out infinite" }} />
              كل الأنظمة تعمل · Uptime 99.98%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export const cloudStory: StoryDef = {
  lang: "bash",
  file: "deploy.sh",
  code,
  Demo: CloudDemo,
  narrative: {
    code: "سكربت نشر حقيقي: بناء الحاوية، فحص أمني، رفع، ثم نشر تدريجي على Kubernetes بلا توقف.",
    build: "بدء خط الأنابيب على بيئة الإنتاج…",
    live: "النشر يجري الآن أمامك سطرًا بسطر، وبعده لوحة مؤشرات حية تتحدث لحظيًا — هكذا نراقب أنظمة عملائنا فعلًا.",
  },
};
