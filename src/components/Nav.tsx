import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { COMPANY, NAV_LINKS, waLink } from "../lib/data";
import { scrollToId, getLenis } from "../lib/scroll";

/* شريط تنقل زجاجي + قائمة ملء الشاشة سينمائية */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const menu = menuRef.current!;
    const links = linksRef.current!.querySelectorAll(".menu-link");
    if (open) {
      getLenis()?.stop();
      gsap.set(menu, { visibility: "visible" });
      gsap.to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" });
      gsap.fromTo(links, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.3, ease: "power3.out" });
    } else {
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power4.inOut",
        onComplete: () => { gsap.set(menu, { visibility: "hidden" }); getLenis()?.start(); },
      });
    }
  }, [open]);

  const go = (id: string) => {
    if (open) {
      setOpen(false);
      setTimeout(() => scrollToId(id), 500);
    } else scrollToId(id);
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-[200] transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
        <div className="shell">
          <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${scrolled ? "glass shadow-[0_20px_60px_rgba(0,0,0,0.5)]" : ""}`}>
            <button onClick={() => go("top")} className="flex items-center gap-3 group" aria-label="Amr AI">
              <img 
                src="/logo.jpg" 
                alt="Amr AI Logo" 
                className="w-10 h-10 rounded-xl object-cover border border-[#94b2ff22] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(41,171,226,0.4)] group-hover:border-[#29abe255]"
              />
              <span className="latin font-bold text-lg tracking-[0.2em]">AMR&nbsp;AI</span>
            </button>

            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="relative text-sm font-bold text-[#c3cddf] hover:text-white transition-colors group">
                  {l.label}
                  <span className="absolute -bottom-1 right-0 h-px w-0 bg-[#5fd4ff] transition-all duration-400 group-hover:w-full shadow-[0_0_8px_rgba(95,212,255,0.9)]" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href={waLink("مرحبًا Amr AI، أريد بدء مشروع جديد.")} target="_blank" rel="noreferrer" className="btn btn-primary !py-2.5 !px-5 !text-sm hidden sm:inline-flex">
                ابدأ مشروعك
              </a>
              <button onClick={() => setOpen(!open)} className="lg:hidden w-11 h-11 rounded-xl glass flex flex-col items-center justify-center gap-1.5" aria-label="القائمة">
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-1" : ""}`} />
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-1" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* قائمة ملء الشاشة */}
      <div ref={menuRef} className="fixed inset-0 z-[190] bg-[#04040c]/97 backdrop-blur-2xl" style={{ clipPath: "inset(0 0 100% 0)", visibility: "hidden" }}>
        <div className="h-full flex flex-col justify-center shell pt-20">
          <div ref={linksRef} className="space-y-2">
            {NAV_LINKS.map((l, i) => (
              <button key={l.id} onClick={() => go(l.id)} className="menu-link group flex items-baseline gap-5 py-2 w-full text-right">
                <span className="num-latin text-sm text-[#5b6579] group-hover:text-[#5fd4ff] transition-colors">0{i + 1}</span>
                <span className="display-3 !font-black text-[#dfe7f5] group-hover:text-transparent group-hover:[-webkit-text-stroke:1.5px_#5fd4ff] transition-all duration-300">{l.label}</span>
                <span className="flex-1 h-px bg-[#141828] group-hover:bg-[#29abe2]/40 transition-colors" />
              </button>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-[#9aa5bc]">
            <span className="num-latin" dir="ltr">{COMPANY.whatsappDisplay}</span>
            <span dir="ltr">{COMPANY.email}</span>
            <span>{COMPANY.hq}</span>
          </div>
        </div>
      </div>
    </>
  );
}
