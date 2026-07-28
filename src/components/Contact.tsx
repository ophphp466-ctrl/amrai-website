import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPANY, waLink } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-content',
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
      className="relative py-32"
      style={{ background: '#030309' }}
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(41,171,226,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="shell relative z-10">
        <div className="contact-content grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, #29abe2, transparent)' }} />
              <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#29abe2', fontFamily: 'Space Grotesk' }}>
                Contact
              </span>
            </div>
            <h2
              className="font-black leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 3vw + 1rem, 4rem)', color: '#eef3fb' }}
            >
              لنبدأ مشروعك القادم
            </h2>
            <p className="mb-10 leading-relaxed" style={{ color: '#9aa5bc', fontSize: '1.1rem' }}>
              نحن هنا لتحويل رؤيتك إلى واقع. تواصل معنا اليوم ودعنا نناقش كيف يمكننا مساعدتك في تحقيق أهدافك.
            </p>

            {/* Contact info cards */}
            <div className="space-y-4">
              <a
                href={waLink('مرحباً، أود التحدث معكم حول مشروعي')}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,17,34,0.8), rgba(6,6,13,0.9))',
                  border: '1px solid rgba(148,178,255,0.1)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(41,171,226,0.15)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#29abe2" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <div className="text-sm" style={{ color: '#5b6579' }}>واتساب</div>
                  <div className="font-bold" style={{ color: '#eef3fb' }}>{COMPANY.whatsappDisplay}</div>
                </div>
              </a>

              <div
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,17,34,0.8), rgba(6,6,13,0.9))',
                  border: '1px solid rgba(148,178,255,0.1)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(123,108,255,0.15)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7b6cff" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                </div>
                <div>
                  <div className="text-sm" style={{ color: '#5b6579' }}>البريد الإلكتروني</div>
                  <div className="font-bold" style={{ color: '#eef3fb' }}>{COMPANY.email}</div>
                </div>
              </div>

              <div
                className="flex items-center gap-4 p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,17,34,0.8), rgba(6,6,13,0.9))',
                  border: '1px solid rgba(148,178,255,0.1)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(143,240,201,0.15)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8ef0c9" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div className="text-sm" style={{ color: '#5b6579' }}>الموقع</div>
                  <div className="font-bold" style={{ color: '#eef3fb' }}>{COMPANY.hq}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="p-8 md:p-10 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(13,17,34,0.9), rgba(6,6,13,0.95))',
              border: '1px solid rgba(148,178,255,0.1)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ background: 'rgba(143,240,201,0.15)', border: '1px solid rgba(143,240,201,0.3)' }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8ef0c9" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-2" style={{ color: '#eef3fb' }}>تم الإرسال بنجاح!</h3>
                <p style={{ color: '#9aa5bc' }}>سنقوم بالرد عليك في أقرب وقت</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#cdd7ea' }}>الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 focus:outline-none"
                    style={{
                      background: 'rgba(9,12,24,0.8)',
                      border: '1px solid rgba(148,178,255,0.15)',
                      color: '#eef3fb',
                    }}
                    placeholder="اسمك الكريم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#cdd7ea' }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 focus:outline-none"
                    style={{
                      background: 'rgba(9,12,24,0.8)',
                      border: '1px solid rgba(148,178,255,0.15)',
                      color: '#eef3fb',
                    }}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#cdd7ea' }}>رسالتك</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 focus:outline-none resize-none"
                    style={{
                      background: 'rgba(9,12,24,0.8)',
                      border: '1px solid rgba(148,178,255,0.15)',
                      color: '#eef3fb',
                    }}
                    placeholder="اخبرنا عن مشروعك..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #29abe2, #1b7fd4)',
                    color: '#02121e',
                    boxShadow: '0 8px 30px rgba(41,171,226,0.35)',
                  }}
                >
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
