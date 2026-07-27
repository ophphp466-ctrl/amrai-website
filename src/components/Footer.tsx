import { COMPANY, NAV_LINKS, SERVICES, waLink } from "../lib/data";
import { scrollToId } from "../lib/scroll";

export default function Footer() {
  return (
    <footer className="border-t border-[#94b2ff12] bg-[#030309]">
      <div className="shell py-14">
        <div className="grid md:grid-cols-[1.3fr,1fr,1fr,1fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" stroke="#5fd4ff" strokeWidth="4" strokeLinecap="round">
                <path d="M50 8a14 14 0 0114 14 14 14 0 0110 24 14 14 0 01-4 26 14 14 0 01-20 10 14 14 0 01-20-10 14 14 0 01-4-26 14 14 0 0110-24A14 14 0 0150 8z" />
                <path d="M38 40l-10 10 10 10M62 40l10 10-10 10M54 34l-8 32" />
              </svg>
              <span className="latin font-bold text-xl tracking-[0.2em]">AMR&nbsp;AI</span>
            </div>
            <p className="text-[13.5px] leading-8 text-[#9aa5bc]">
              شريكك في رحلة التحول الرقمي — نحوّل الأفكار إلى واقعٍ رقميٍ ذكي منذ 12+ سنة.
            </p>
            <a href={waLink("مرحبًا Amr AI 👋")} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2.5 !px-5 !text-sm mt-5">
              💬 تحدث معنا الآن
            </a>
          </div>

          <div>
            <div className="text-[12px] font-black tracking-[0.2em] text-[#5b6579] mb-4">الخدمات</div>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <button onClick={() => scrollToId("services")} className="text-[13.5px] text-[#9aa5bc] hover:text-[#5fd4ff] transition-colors">{s.title}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[12px] font-black tracking-[0.2em] text-[#5b6579] mb-4">الشركة</div>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollToId(l.id)} className="text-[13.5px] text-[#9aa5bc] hover:text-[#5fd4ff] transition-colors">{l.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[12px] font-black tracking-[0.2em] text-[#5b6579] mb-4">تواصل</div>
            <ul className="space-y-3 text-[13.5px] text-[#9aa5bc]">
              <li><a className="hover:text-[#5fd4ff] transition-colors num-latin" dir="ltr" href={waLink("مرحبًا Amr AI 👋")} target="_blank" rel="noreferrer">{COMPANY.whatsappDisplay}</a></li>
              <li><a className="hover:text-[#5fd4ff] transition-colors" dir="ltr" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li>{COMPANY.hq}</li>
              <li>{COMPANY.hours}</li>
            </ul>
          </div>
        </div>

        <div className="divider-glow my-10" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-[12.5px] text-[#5b6579]">
          <span>© 2026 Amr AI — جميع الحقوق محفوظة.</span>
          <span>صُنع بـ <span className="text-[#29abe2]">♥</span> في مصر · Genesis Edition</span>
        </div>
      </div>
    </footer>
  );
}
