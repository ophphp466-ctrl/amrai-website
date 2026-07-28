import { COMPANY } from '../lib/data';

export default function Footer() {
  return (
    <footer className="relative py-16" style={{ background: '#020208', borderTop: '1px solid rgba(148,178,255,0.06)' }}>
      <div className="shell">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
              style={{ background: 'linear-gradient(135deg, #29abe2, #1b7fd4)', color: '#02121e' }}
            >
              A
            </div>
            <span className="font-bold text-lg" style={{ color: '#eef3fb' }}>{COMPANY.name}</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['الخدمات', 'قصص النجاح', 'تواصل معنا'].map((link) => (
              <a
                key={link}
                href={`#${link === 'الخدمات' ? 'services' : link === 'قصص النجاح' ? 'work' : 'contact'}`}
                className="text-sm transition-colors duration-300 hover:text-white"
                style={{ color: '#5b6579' }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm" style={{ color: '#5b6579' }}>
            © 2026 {COMPANY.name}. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </footer>
  );
}
