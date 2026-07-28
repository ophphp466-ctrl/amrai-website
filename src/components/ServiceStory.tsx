import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Service } from "../lib/data";
import { typeCode, type TyperHandle } from "../lib/fx";
import { getLenis } from "../lib/scroll";
import { webStory } from "./stories/WebStory";
import { aiStory } from "./stories/AIStory";
import { mobileStory } from "./stories/MobileStory";
import { automationStory } from "./stories/AutomationStory";
import { cloudStory } from "./stories/CloudStory";
import { consultingStory } from "./stories/ConsultingStory";
import type { StoryDef } from "./stories/types";

const STORIES: Record<string, StoryDef> = {
  web: webStory, ai: aiStory, mobile: mobileStory,
  automation: automationStory, cloud: cloudStory, consulting: consultingStory,
};

type Phase = "code" | "build" | "live";

/* قصة الخدمة التفاعلية: الكود يُكتب → يُبنى → يعمل أمامك */
export default function ServiceStory({ service, onClose }: { service: Service; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("code");
  const [progress, setProgress] = useState(0);
  const [runId, setRunId] = useState(0);
  const typer = useRef<TyperHandle | null>(null);
  const story = STORIES[service.id];

  /* فتح الستارة + بدء الكتابة */
  useEffect(() => {
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    gsap.set(root.current, { visibility: "visible" });
    gsap.to(root.current, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power4.inOut" });
    gsap.fromTo(".story-side > *", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, delay: 0.5, duration: 0.8, ease: "power3.out" });

    const t = setTimeout(startTyping, 900);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      typer.current?.cancel();
      document.body.style.overflow = "";
      getLenis()?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTyping = () => {
    setPhase("code");
    setProgress(0);
    typer.current?.cancel();
    if (!editorRef.current) return;
    typer.current = typeCode(editorRef.current, story.code, story.lang, {
      cps: 380,
      onProgress: setProgress,
    });
    typer.current.done.then(goLive);
  };

  const goLive = () => {
    setPhase("build");
    // المحرر يتقلص ويختفي، والمنتج ينبثق
    const tl = gsap.timeline();
    tl.to(stageRef.current, { scale: 0.92, rotateX: 8, opacity: 0, duration: 0.55, ease: "power3.in", transformPerspective: 1000 })
      .add(() => setPhase("live"))
      .fromTo(stageRef.current, { scale: 0.92, rotateX: -8, opacity: 0 }, { scale: 1, rotateX: 0, opacity: 1, duration: 0.85, ease: "power4.out", transformPerspective: 1000 });
  };

  const close = () => {
    typer.current?.cancel();
    gsap.to(root.current, {
      clipPath: "inset(100% 0 0 0)", duration: 0.7, ease: "power4.inOut",
      onComplete: () => { gsap.set(root.current, { visibility: "hidden" }); onClose(); },
    });
  };

  const phases: { id: Phase; label: string }[] = [
    { id: "code", label: "1 · الكود" },
    { id: "build", label: "2 · البناء" },
    { id: "live", label: "3 · يعمل الآن" },
  ];

  const narrative = phase === "code" ? story.narrative.code : phase === "build" ? story.narrative.build : story.narrative.live;

  return (
    <div ref={root} className="story-overlay overflow-y-auto" role="dialog" aria-modal="true" aria-label={service.storyTitle}>
      {/* خلفية متوهجة */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(900px 500px at 70% 10%, ${service.accent}14, transparent 60%)` }} />

      <div className="relative min-h-screen shell py-8 flex flex-col">
        {/* الرأس */}
        <div className="story-side flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={service.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={service.icon} /></svg>
            </div>
            <div>
              <div className="latin text-[10px] tracking-[0.3em] uppercase" style={{ color: service.accent }}>{service.latin} · LIVE STORY</div>
              <h2 className="text-xl font-black text-white">{service.storyTitle}</h2>
            </div>
          </div>
          <button onClick={close} className="btn btn-ghost !py-2.5 !px-5 !text-sm" aria-label="إغلاق">
            إغلاق ✕
          </button>
        </div>

        {/* مراحل */}
        <div className="story-side flex flex-wrap items-center gap-2 pb-6">
          {phases.map((p) => (
            <span key={p.id} className={`phase-pill ${phase === p.id ? "active" : phases.findIndex((x) => x.id === phase) > phases.findIndex((x) => x.id === p.id) ? "done" : ""}`}>
              {p.label}
            </span>
          ))}
          <div className="flex-1 min-w-[120px] h-px bg-[#141828] relative mx-2">
            <div className="absolute inset-y-0 right-0 transition-all duration-300" style={{ width: `${phase === "code" ? progress * 100 : 100}%`, background: service.accent, boxShadow: `0 0 10px ${service.accent}` }} />
          </div>
          {phase === "code" && (
            <button onClick={() => typer.current?.skip()} className="text-sm font-bold text-[#9aa5bc] hover:text-white transition-colors">
              تخطَّ الكتابة ⏩
            </button>
          )}
        </div>

        {/* المسرح + السرد */}
        <div className="flex-1 grid lg:grid-cols-[1.35fr,0.65fr] gap-6 items-start pb-10">
          <div ref={stageRef} className="will-change-transform" key={runId}>
            {phase !== "live" ? (
              <div className="editor">
                <div className="editor-bar">
                  <span className="editor-dot bg-[#ff5f57]" /><span className="editor-dot bg-[#febc2e]" /><span className="editor-dot bg-[#28c840]" />
                  <span className="mono text-[11px] text-[#7c8db0] ml-3">{story.file} — Amr AI Studio</span>
                  <span className="mono text-[10px] text-[#5fd4ff] mr-auto" dir="ltr">{Math.round(progress * 100)}%</span>
                </div>
                <div ref={editorRef} className="editor-body" />
              </div>
            ) : (
              <div className="story-stage-frame p-4 md:p-5 min-h-[480px]">
                <story.Demo />
              </div>
            )}
          </div>

          <aside className="story-side space-y-5 lg:sticky lg:top-8">
            <p className="text-lg leading-9 text-[#dbe4f5] font-semibold min-h-[72px]" key={phase}>
              {narrative}
            </p>
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="text-[11px] font-black tracking-[0.25em] text-[#5b6579] latin">WHY IT MATTERS</div>
              <p className="text-[13.5px] leading-7 text-[#9aa5bc]">{service.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {service.tech.map((t) => <span key={t} className="chip !text-[11px]">{t}</span>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {phase === "live" && (
                <button onClick={() => { setRunId((r) => r + 1); setPhase("code"); setTimeout(startTyping, 60); }} className="btn btn-ghost !py-2.5 !text-sm">
                  ↻ أعد القصة من البداية
                </button>
              )}
              <a href={`https://wa.me/201090991769?text=${encodeURIComponent(`مرحبًا Amr AI، شاهدت قصة «${service.title}» التفاعلية وأريد مناقشة مشروعي.`)}`}
                target="_blank" rel="noreferrer" className="btn btn-primary !py-2.5 !text-sm">
                أريد هذا لمشروعي ←
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
