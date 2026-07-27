import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis, getLenis } from "./lib/scroll";
import useScrollReveal from "./hooks/useScrollReveal";
import Preloader from "./components/Preloader";
import EnhancedCursor from "./components/EnhancedCursor";
import ParticleField from "./components/ParticleField";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import { Marquee } from "./components/Bits";
import Services from "./components/Services";
import ServiceStory from "./components/ServiceStory";
import Cases from "./components/Cases";
import Tools from "./components/Tools";
import Blog, { ArticleReader } from "./components/Blog";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import type { Service } from "./lib/data";
import type { Article } from "./lib/articles";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "ذكاء اصطناعي", "تطوير ويب سينمائي", "تطبيقات موبايل", "أتمتة ذكية",
  "حلول سحابية", "استشارات تقنية", "أداء 100/100", "تصميم يفوز بالجوائز",
];

/* Scroll Progress Bar */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      if (!barRef.current) return;
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scroll / height) * 100 : 0;
      barRef.current.style.width = `${progress}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-transparent">
      <div ref={barRef} className="h-full bg-gradient-to-r from-[#29abe2] via-[#5fd4ff] to-[#7b6cff] transition-[width] duration-100" style={{ width: "0%" }} />
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState<Service | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  /* Scroll reveal animations */
  useScrollReveal();

  /* Lenis + ScrollTrigger */
  useEffect(() => {
    const lenis = initLenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); };
  }, []);

  /* ScrollTrigger refresh بعد التحميل */
  useEffect(() => {
    if (ready) setTimeout(() => ScrollTrigger.refresh(), 120);
  }, [ready]);

  /* إيقاف التمرير أثناء البريلودر */
  useEffect(() => {
    const lenis = getLenis();
    if (!ready) { lenis?.stop(); document.body.style.overflow = "hidden"; }
    else { lenis?.start(); document.body.style.overflow = ""; }
  }, [ready]);

  /* Pinned scroll storytelling */
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Section transitions - each section fades in dramatically
      gsap.utils.toArray<HTMLElement>(".story-section").forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0.3, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            }
          }
        );
      });

      // Marquee sections parallax
      gsap.utils.toArray<HTMLElement>(".marquee-section").forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0.5, scale: 0.98 },
          {
            opacity: 1, scale: 1, duration: 1, ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 60%",
              scrub: 1,
            }
          }
        );
      });

      // Cinematic divider lines
      gsap.utils.toArray<HTMLElement>(".cine-divider").forEach((divider) => {
        gsap.fromTo(divider,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.5, ease: "power3.inOut",
            scrollTrigger: {
              trigger: divider,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div className="relative">
      <ScrollProgress />
      
      {/* ONE unified neural background */}
      <ParticleField />
      <div className="grain-layer" aria-hidden="true" />
      
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Nav />

      <main ref={mainRef}>
        <Hero ready={ready} />
        
        <div className="cine-divider section-divider origin-center" />
        
        <div className="marquee-section">
          <Marquee items={MARQUEE_ITEMS} />
        </div>
        
        <div className="story-section">
          <Services onOpenStory={setStory} />
        </div>
        
        <div className="cine-divider section-divider origin-center" />
        
        <div className="story-section">
          <Cases />
        </div>
        
        <div className="cine-divider section-divider origin-center" />
        
        <div className="story-section">
          <Tools />
        </div>
        
        <div className="marquee-section">
          <Marquee items={["+500 مشروع ناجح", "98% رضا العملاء", "12+ سنة خبرة", "+350% نمو مبيعات", "رد خلال 24 ساعة"]} reverse />
        </div>
        
        <div className="story-section">
          <Blog onOpen={setArticle} />
        </div>
        
        <div className="cine-divider section-divider origin-center" />
        
        <div className="story-section">
          <Pricing />
        </div>
        
        <div className="story-section">
          <Contact />
        </div>
      </main>

      <Footer />

      {/* الطبقات السردية */}
      {story && <ServiceStory key={story.id} service={story} onClose={() => setStory(null)} />}
      {article && <ArticleReader key={article.id} article={article} onClose={() => setArticle(null)} />}
    </div>
  );
}
