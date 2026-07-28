import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CASES } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   CASES — Film Reel Section 3
   Horizontal Scroll Gallery with 3D Perspective
   ═══════════════════════════════════════════════════════════ */

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!galleryRef.current) return;
      const items = galleryRef.current.querySelectorAll<HTMLElement>('.gallery-item');

      // Horizontal scroll
      gsap.to(items, {
        xPercent: -100 * (items.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${items.length * window.innerWidth * 0.6}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (items.length - 1),
            duration: { min: 0.2, max: 0.4 },
            ease: 'power2.inOut',
          },
        },
      });

      // Individual item parallax
      items.forEach((item) => {
        const img = item.querySelector('.case-image');
        if (img) {
          gsap.fromTo(img,
            { scale: 1.2 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                containerAnimation: gsap.getById?.('horizontal') as any,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      data-reel-section
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#030309' }}
    >
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123,108,255,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-center">
        {/* Header */}
        <div data-reel-text className="shell mb-8 opacity-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #7b6cff)' }} />
            <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#7b6cff', fontFamily: 'Space Grotesk' }}>
              Case Studies
            </span>
          </div>
          <h2
            className="font-black leading-tight"
            style={{
              fontSize: 'clamp(2rem, 3vw + 1rem, 4rem)',
              color: '#eef3fb',
            }}
          >
            قصص نجاح حقيقية
          </h2>
        </div>

        {/* Horizontal Gallery */}
        <div
          ref={galleryRef}
          className="flex gap-8 pl-[5vw]"
          style={{
            width: `${CASES.length * 60 + 20}vw`,
            perspective: '1200px',
          }}
        >
          {CASES.map((c, i) => (
            <div
              key={c.id}
              data-reel-visual
              className="gallery-item flex-shrink-0 w-[55vw] max-w-[700px] h-[60vh] rounded-3xl overflow-hidden relative group opacity-0"
              style={{
                background: 'linear-gradient(135deg, rgba(13,17,34,0.9), rgba(6,6,13,0.95))',
                border: '1px solid rgba(148,178,255,0.1)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Case image placeholder */}
              <div className="case-image absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${c.accent}10, #0a0a16)`,
                  }}
                />
                {/* Decorative pattern */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${c.accent}40 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent 30%, rgba(3,3,9,0.9) 100%)',
                  }}
                />

                <div className="relative z-10">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                    style={{
                      background: `${c.accent}15`,
                      color: c.accent,
                      border: `1px solid ${c.accent}30`,
                    }}
                  >
                    {c.field}
                  </span>
                  <h3
                    className="font-black mb-3"
                    style={{ fontSize: 'clamp(1.3rem, 2vw + 0.5rem, 2rem)', color: '#eef3fb' }}
                  >
                    {c.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed" style={{ color: '#9aa5bc' }}>
                    {c.desc}
                  </p>

                  {/* Metrics */}
                  <div className="flex gap-4">
                    {c.metrics.map((m, j) => (
                      <div
                        key={j}
                        className="px-4 py-2 rounded-xl"
                        style={{
                          background: 'rgba(13,17,34,0.6)',
                          border: '1px solid rgba(148,178,255,0.08)',
                        }}
                      >
                        <div className="text-lg font-black" style={{ color: c.accent, fontFamily: 'Space Grotesk' }}>
                          {m.value}
                        </div>
                        <div className="text-[10px]" style={{ color: '#5b6579' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1px ${c.accent}40, 0 0 40px ${c.accent}15`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div data-reel-text className="shell mt-6 flex items-center gap-3 opacity-0">
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg, #7b6cff, transparent)' }} />
          <span className="text-xs" style={{ color: '#5b6579' }}>اسحب للتنقل بين القصص</span>
        </div>
      </div>
    </section>
  );
}
