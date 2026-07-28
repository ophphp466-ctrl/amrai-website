import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   SERVICES — Film Reel Section 2
   3D Tilt Cards + Magnetic Buttons + Parallax
   ═══════════════════════════════════════════════════════════ */

/* ── 3D Tilt Card ───────────────────────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;

    gsap.to(ref.current, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

/* ── Magnetic Element ───────────────────────────────────── */
function MagneticElement({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on background
      gsap.to('.services-glow', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      data-reel-section
      className="relative h-screen w-full flex items-center overflow-hidden"
      style={{ background: '#030309' }}
    >
      {/* Background glow */}
      <div
        className="services-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="shell relative z-10 w-full">
        {/* Section Header */}
        <div data-reel-text className="text-center mb-16 opacity-0">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #29abe2)' }} />
            <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#29abe2', fontFamily: 'Space Grotesk' }}>
              Our Services
            </span>
            <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, #29abe2, transparent)' }} />
          </div>
          <h2
            className="font-black leading-tight"
            style={{
              fontSize: 'clamp(2rem, 3vw + 1rem, 4.5rem)',
              color: '#eef3fb',
            }}
          >
            حلول تقنية متكاملة
          </h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: '#9aa5bc', fontSize: '1.1rem' }}>
            نقدم مجموعة واسعة من الخدمات التقنية المتقدمة
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
          {SERVICES.map((service) => (
            <TiltCard key={service.id} className="group">
              <div
                data-reel-visual
                className="relative p-6 rounded-2xl h-full opacity-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,17,34,0.8), rgba(6,6,13,0.9))',
                  border: '1px solid rgba(148,178,255,0.1)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at 50% 0%, ${service.accent}15, transparent 60%)`,
                  }}
                />

                {/* Number */}
                <span
                  className="absolute top-4 right-4 font-black text-5xl opacity-10"
                  style={{ color: service.accent, fontFamily: 'Space Grotesk' }}
                >
                  {service.index}
                </span>

                {/* Icon */}
                <MagneticElement strength={0.2}>
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${service.accent}20, transparent)`,
                      border: `1px solid ${service.accent}30`,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={service.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={service.icon} />
                    </svg>
                  </div>
                </MagneticElement>

                {/* Title */}
                <h3 className="text-lg font-black mb-1" style={{ color: '#eef3fb' }}>
                  {service.title}
                </h3>
                <span className="text-xs font-medium mb-3 block" style={{ color: service.accent, fontFamily: 'Space Grotesk' }}>
                  {service.latin}
                </span>

                {/* Description */}
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9aa5bc' }}>
                  {service.desc.slice(0, 80)}...
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                  {service.tech.map((t, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        background: `${service.accent}15`,
                        color: service.accent,
                        border: `1px solid ${service.accent}25`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
