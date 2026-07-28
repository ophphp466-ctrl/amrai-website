import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo('.services-title',
        { opacity: 0, y: 80, rotateX: 30 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Cards staggered reveal with 3D flip
      const cards = gsap.utils.toArray<HTMLElement>('.service-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 100, rotateY: -15, scale: 0.9 },
          {
            opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 1,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });

      // Horizontal parallax on the row
      gsap.to(cardsRef.current, {
        x: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: '#030309' }}
    >
      {/* Section background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="shell relative z-10">
        {/* Section Header */}
        <div className="services-title text-center mb-20" style={{ perspective: '1000px' }}>
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
          <p className="mt-6 max-w-2xl mx-auto" style={{ color: '#9aa5bc', fontSize: '1.1rem', lineHeight: 1.8 }}>
            نقدم مجموعة واسعة من الخدمات التقنية المتقدمة، من تطوير الويب إلى الذكاء الاصطناعي
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className="service-card group relative p-8 rounded-3xl transition-all duration-700 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(13,17,34,0.8), rgba(6,6,13,0.9))',
                border: '1px solid rgba(148,178,255,0.1)',
                transformStyle: 'preserve-3d',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(400px circle at 50% 0%, ${service.accent}15, transparent 60%)`,
                }}
              />

              {/* Number */}
              <span
                className="absolute top-6 right-6 font-black text-6xl opacity-10"
                style={{ color: service.accent, fontFamily: 'Space Grotesk' }}
              >
                {service.index}
              </span>

              {/* Icon */}
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}20, transparent)`,
                  border: `1px solid ${service.accent}30`,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={service.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={service.icon} />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black mb-2" style={{ color: '#eef3fb' }}>
                {service.title}
              </h3>
              <span className="text-sm font-medium mb-4 block" style={{ color: service.accent, fontFamily: 'Space Grotesk' }}>
                {service.latin}
              </span>

              {/* Description */}
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9aa5bc' }}>
                {service.desc}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.slice(0, 3).map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: '#cdd7ea' }}>
                    <span style={{ color: service.accent }}>◆</span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {service.tech.map((t, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 rounded-full text-xs font-bold"
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
          ))}
        </div>
      </div>
    </section>
  );
}
