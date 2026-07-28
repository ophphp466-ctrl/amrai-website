import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CASES } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ── Before/After Reveal Slider ─────────────────────────── */
function BeforeAfterSlider({ accent }: { accent: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize"
      style={{ touchAction: 'none' }}
      onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseDown={(e) => { isDragging.current = true; handleMove(e.clientX); }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchStart={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* "After" (improved) side */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}15, #0a0a16)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span className="text-lg font-bold" style={{ color: accent }}>بعد التحسين</span>
          </div>
        </div>
      </div>

      {/* "Before" side with clip */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          background: 'linear-gradient(135deg, #1a1a2e, #0a0a16)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff6464" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </div>
            <span className="text-lg font-bold" style={{ color: '#ff6464' }}>قبل التحسين</span>
          </div>
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px]"
        style={{
          left: `${sliderPos}%`,
          background: accent,
          boxShadow: `0 0 20px ${accent}80`,
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: accent,
            boxShadow: `0 0 20px ${accent}80`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#02121e" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  );
}

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo('.cases-header',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Case cards stagger
      gsap.utils.toArray<HTMLElement>('.case-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? -80 : 80, scale: 0.95 },
          {
            opacity: 1, x: 0, scale: 1, duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-32"
      style={{ background: '#030309' }}
    >
      {/* Background gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123,108,255,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="shell relative z-10">
        {/* Header */}
        <div className="cases-header text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #7b6cff)' }} />
            <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#7b6cff', fontFamily: 'Space Grotesk' }}>
              Case Studies
            </span>
            <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, #7b6cff, transparent)' }} />
          </div>
          <h2
            className="font-black leading-tight"
            style={{
              fontSize: 'clamp(2rem, 3vw + 1rem, 4.5rem)',
              color: '#eef3fb',
            }}
          >
            قصص نجاح حقيقية
          </h2>
          <p className="mt-6 max-w-2xl mx-auto" style={{ color: '#9aa5bc', fontSize: '1.1rem', lineHeight: 1.8 }}>
            نتائج ملموسة حققناها لعملائنا في مختلف المجالات
          </p>
        </div>

        {/* Cases */}
        <div className="space-y-20">
          {CASES.map((c, i) => (
            <div
              key={c.id}
              className={`case-card grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Content */}
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <span
                  className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
                  style={{
                    background: `${c.accent}15`,
                    color: c.accent,
                    border: `1px solid ${c.accent}30`,
                  }}
                >
                  {c.field}
                </span>
                <h3
                  className="font-black mb-4"
                  style={{ fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.5rem)', color: '#eef3fb' }}
                >
                  {c.title}
                </h3>
                <p className="mb-8 leading-relaxed" style={{ color: '#9aa5bc', fontSize: '1.05rem' }}>
                  {c.desc}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {c.metrics.map((m, j) => (
                    <div
                      key={j}
                      className="p-4 rounded-2xl text-center"
                      style={{
                        background: 'rgba(13,17,34,0.6)',
                        border: '1px solid rgba(148,178,255,0.08)',
                      }}
                    >
                      <div
                        className="text-2xl font-black mb-1"
                        style={{ color: c.accent, fontFamily: 'Space Grotesk' }}
                      >
                        {m.value}
                      </div>
                      <div className="text-xs" style={{ color: '#5b6579' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <BeforeAfterSlider accent={c.accent} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
