import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis, getLenis } from "./lib/scroll";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
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

export default function App() {
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState<Service | null>(null);
  const [article, setArticle] = useState<Article | null>(null);

  /* Lenis + ScrollTrigger */
  useEffect(() => {
    const lenis = initLenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); };
  }, []);

  /* ScrollTrigger refresh after preloader */
  useEffect(() => {
    if (ready) setTimeout(() => ScrollTrigger.refresh(), 300);
  }, [ready]);

  /* Stop scroll during preloader */
  useEffect(() => {
    const lenis = getLenis();
    if (!ready) { lenis?.stop(); document.body.style.overflow = "hidden"; }
    else { lenis?.start(); document.body.style.overflow = ""; }
  }, [ready]);

  /* Global scroll-driven cinematic effects */
  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      // Each section reveals cinematically
      gsap.utils.toArray<HTMLElement>(".cine-section").forEach((section, i) => {
        gsap.fromTo(section,
          { opacity: 0.2, y: 60 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <div className="relative bg-[#030309]">
      {/* Subtle film grain */}
      <div className="grain-layer" aria-hidden="true" />
      
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Nav />

      <main>
        <Hero ready={ready} />
        
        <div className="cine-section">
          <Services onOpenStory={setStory} />
        </div>
        
        <div className="cine-section">
          <Cases />
        </div>
        
        <div className="cine-section">
          <Tools />
        </div>
        
        <div className="cine-section">
          <Blog onOpen={setArticle} />
        </div>
        
        <div className="cine-section">
          <Pricing />
        </div>
        
        <div className="cine-section">
          <Contact />
        </div>
      </main>

      <Footer />

      {/* Story overlays */}
      {story && <ServiceStory key={story.id} service={story} onClose={() => setStory(null)} />}
      {article && <ArticleReader key={article.id} article={article} onClose={() => setArticle(null)} />}
    </div>
  );
}
