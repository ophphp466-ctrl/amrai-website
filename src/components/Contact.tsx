import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { COMPANY, waLink } from '../lib/data';

/* ═══════════════════════════════════════════════════════════
   CONTACT — Film Reel Section 4
   Cinematic Form with Glow Effects
   ═══════════════════════════════════════════════════════════ */

/* ── Magnetic Button ────────────────────────────────────── */
function MagneticBtn({ children, href, onClick, primary = false }: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  const Comp = href ? 'a' : 'button';
  const props = href ? { href } : { onClick };

  return (
    <Comp
      ref={ref as any}
      {...props}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-shadow duration-500"
      style={{
        background: primary
          ? 'linear-gradient(135deg, #29abe2, #1b7fd4)'
          : 'rgba(149,190,255,0.04)',
        color: primary ? '#02121e' : '#eef3fb',
        border: primary ? 'none' : '1px solid rgba(148,178,255,0.2)',
        backdropFilter: primary ? 'none' : 'blur(12px)',
        boxShadow: primary ? '0 8px 30px rgba(41,171,226,0.35)' : 'none',
        willChange: 'transform',
        cursor: 'pointer',
      }}
    >
      <span className="relative z-10">{children}</span>
    </Comp>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background glow parallax
      gsap.to('.contact-glow', {
        y: -80,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-reel-section
      className="relative h-screen w-full flex items-center overflow-hidden"
      style={{ background: '#030309' }}
    >
      {/* Background glow */}
      <div
        className="contact-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(41,171,226,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="shell relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-h-[80vh] overflow-y-auto pr-2">
          {/* Left: Info */}
          <div>
            <div data-reel-text className="flex items-center gap-4 mb-6 opacity-0">
              <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, #29abe2, transparent)' }} />
              <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#29abe2', fontFamily: 'Space Grotesk' }}>
                Contact
              </span>
            </div>
            <h2
              data-reel-text
              className="font-black leading-tight mb-6 opacity-0"
              style={{ fontSize: 'clamp(2rem, 3vw + 1rem, 3.5rem)', color: '#eef3fb' }}
            >
              لنبدأ مشروعك القادم
            </h2>
            <p data-reel-text className="mb-8 leading-relaxed opacity-0" style={{ color: '#9aa5bc', fontSize: '1.05rem' }}>
              نحن هنا لتحويل رؤيتك إلى واقع. تواصل معنا اليوم.
            </p>

            {/* Contact cards */}
            <div className="space-y-3">
              {[
                { icon: 'phone', label: 'واتساب', value: COMPANY.whatsappDisplay, href: waLink('مرحباً، أود التحدث معكم حول مشروعي'), accent: '#29abe2' },
                { icon: 'mail', label: 'البريد الإلكتروني', value: COMPANY.email, href: `mailto:${COMPANY.email}`, accent: '#7b6cff' },
                { icon: 'map', label: 'الموقع', value: COMPANY.hq, href: '#', accent: '#8ef0c9' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  data-reel-visual
                  className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] opacity-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(13,17,34,0.8), rgba(6,6,13,0.9))',
                    border: '1px solid rgba(148,178,255,0.1)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.accent}15` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="2">
                      {item.icon === 'phone' && <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>}
                      {item.icon === 'mail' && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></>}
                      {item.icon === 'map' && <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>}
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#5b6579' }}>{item.label}</div>
                    <div className="text-sm font-bold" style={{ color: '#eef3fb' }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            data-reel-visual
            className="p-6 md:p-8 rounded-3xl opacity-0"
            style={{
              background: 'linear-gradient(135deg, rgba(13,17,34,0.9), rgba(6,6,13,0.95))',
              border: '1px solid rgba(148,178,255,0.1)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            }}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'rgba(143,240,201,0.15)', border: '1px solid rgba(143,240,201,0.3)' }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8ef0c9" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-xl font-black mb-1" style={{ color: '#eef3fb' }}>تم الإرسال بنجاح!</h3>
                <p className="text-sm" style={{ color: '#9aa5bc' }}>سنقوم بالرد عليك في أقرب وقت</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#cdd7ea' }}>الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none"
                    style={{
                      background: 'rgba(9,12,24,0.8)',
                      border: '1px solid rgba(148,178,255,0.15)',
                      color: '#eef3fb',
                    }}
                    placeholder="اسمك الكريم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#cdd7ea' }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none"
                    style={{
                      background: 'rgba(9,12,24,0.8)',
                      border: '1px solid rgba(148,178,255,0.15)',
                      color: '#eef3fb',
                    }}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#cdd7ea' }}>رسالتك</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none resize-none"
                    style={{
                      background: 'rgba(9,12,24,0.8)',
                      border: '1px solid rgba(148,178,255,0.15)',
                      color: '#eef3fb',
                    }}
                    placeholder="اخبرنا عن مشروعك..."
                  />
                </div>
                <MagneticBtn primary onClick={() => {}}>
                  إرسال الرسالة
                </MagneticBtn>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
