import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { SectionHead } from "./Bits";

/* ═══════════════════════════════════════════════════════════
   AMR AI — Horizontal Scroll Showcase
   Cinematic horizontal-scrolling gallery section
   ═══════════════════════════════════════════════════════════ */

const SHOWCASE_ITEMS = [
  {
    id: 1,
    title: "تجربة AI تفاعلية",
    subtitle: "منصة ذكاء اصطناعي متكاملة",
    desc: "نظام ذكاء اصطناعي متقدم يتعلم من تفاعلات المستخدمين ويقدم توصيات شخصية بدقة 98%",
    metric: "+350%",
    metricLabel: "نمو المبيعات",
    color: "#29abe2",
  },
  {
    id: 2,
    title: "موقع سينمائي",
    subtitle: "تجربة ويب immersive",
    desc: "موقع بتقنيات WebGL و Three.js يقدم تجربة مستخدم لا تُنسى مع أداء 100/100",
    metric: "0.8s",
    metricLabel: "وقت التحميل",
    color: "#7b6cff",
  },
  {
    id: 3,
    title: "تطبيق موبايل",
    subtitle: "تجربة native متكاملة",
    desc: "تطبيق iOS و Android مع أداء سلس وميزات offline وإشعارات ذكية",
    metric: "4.9★",
    metricLabel: "تقييم المتجر",
    color: "#ffd166",
  },
  {
    id: 4,
    title: "أتمتة ذكية",
    subtitle: "سير عمل آلي متكامل",
    desc: "نظام أتمتة يوفر 40 ساعة عمل أسبوعيًا مع دقة تنفيذ تصل إلى 99.7%",
    metric: "40h",
    metricLabel: "توفير أسبوعي",
    color: "#5fd4ff",
  },
  {
    id: 5,
    title: "حلول سحابية",
    subtitle: "بنية تحتية متقدمة",
    desc: "بنية تحتية سحابية قابلة للتوسع مع أمان على مستوى المؤسسات وتوفر 99.99%",
    metric: "99.99%",
    metricLabel: "نسبة التوفر",
    color: "#0a5f8f",
  },
];

function ShowcaseCard({ item, index }: { item: typeof SHOWCASE_ITEMS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const rx = ((py / r.height) - 0.5) * -10;
      const ry = ((px / r.width) - 0.5) * 10;

      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1000,
        duration: 0.4,
        ease: "power2.out",
      });

      card.style.setProperty("--mx", `${px}px`);
      card.style.setProperty("--my", `${py}px`);
    };

    const onLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
      });
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="showcase-card flex-shrink-0 w-[85vw] md:w-[600px] h-[500px] md:h-[550px] rounded-3xl p-8 md:p-10 flex flex-col justify-between cursor-pointer will-change-transform"
      style={{
        background: `linear-gradient(135deg, ${item.color}11, ${item.color}05)`,
        border: `1px solid ${item.color}33`,
        transformStyle: "preserve-3d",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Glow spot effect */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), ${item.color}22, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-7xl md:text-8xl font-black opacity-20"
            style={{ color: item.color, fontFamily: "var(--font-latin)" }}
          >
            0{index + 1}
          </span>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: `${item.color}22`, border: `1px solid ${item.color}44` }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <div className="latin text-xs tracking-[0.3em] uppercase mb-3" style={{ color: item.color }}>
          {item.subtitle}
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4">{item.title}</h3>
        <p className="text-[15px] leading-8 text-[#9aa5bc]">{item.desc}</p>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-4xl md:text-5xl font-black" style={{ color: item.color, fontFamily: "var(--font-latin)" }}>
            {item.metric}
          </div>
          <div className="text-sm text-[#5b6579] font-bold mt-1">{item.metricLabel}</div>
        </div>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: item.color, color: "#02121e" }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5m6-7l-7 7 7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Calculate scroll distance
      const scrollWidth = track.scrollWidth - window.innerWidth;

      // Create horizontal scroll animation
      const tween = gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
          },
        },
      });

      // Animate cards entering
      gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, rotateY: -15 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 90%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="showcase" className="relative bg-[#030309] overflow-hidden">
      <div className="shell pt-20 pb-10">
        <SectionHead
          kicker="SHOWCASE · معرض الإبداع"
          title="مشاريع تتحدث عن نفسها"
          sub="اسحب للتنقل — كل مشروع يحمل قصة نجاح فريدة."
        />
      </div>

      {/* Progress bar */}
      <div className="shell mb-8">
        <div className="h-[2px] bg-[#141828] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #29abe2, #7b6cff, #5fd4ff)",
            }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-[#5b6579] font-bold">
          <span>ابدأ</span>
          <span>{Math.round(progress * 100)}%</span>
          <span>النهاية</span>
        </div>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="flex gap-6 pl-[8vw] pr-[20vw] pb-20 will-change-transform">
        {SHOWCASE_ITEMS.map((item, i) => (
          <ShowcaseCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
