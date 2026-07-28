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
  const lineRef = useRef<HTMLDivElement>(null);

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
    if (ready) setTimeout(() => ScrollTrigger.refresh(), 200);
  }, [ready]);

  /* Stop scroll during preloader */
  useEffect(() => {
    const lenis = getLenis();
    if (!ready) { lenis?.stop(); document.body.style.overflow = "hidden"; }
    else { lenis?.start(); document.body.style.overflow = ""; }
  }, [ready]);

  /* The Line — continuous scroll animation */
  useEffect(() => {
    if (!ready || !lineRef.current) return;
    
    const ctx = gsap.context(() => {
      // The line glows brighter as you scroll
      gsap.to(lineRef.current, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        opacity: 0.6,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <div className="relative">
      {/* The Line — one continuous thread through the entire page */}
      <div 
        ref={lineRef}
        className="fixed left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-[5] pointer-events-none"
        style={{ 
          background: "linear-gradient(180deg, transparent 0%, rgba(41,171,226,0.3) 10%, rgba(41,171,226,0.2) 50%, rgba(41,171,226,0.3) 90%, transparent 100%)",
          boxShadow: "0 0 30px rgba(41,171,226,0.15), 0 0 80px rgba(41,171,226,0.05)",
          opacity: 0.3,
        }}
      />

      {/* Subtle film grain */}
      <div className="grain-layer" aria-hidden="true" />
      
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Nav />

      <main>
        <Hero ready={ready} />
        <Services onOpenStory={setStory} />
        <Cases />
        <Tools />
        <Blog onOpen={setArticle} />
        <Pricing />
        <Contact />
      </main>

      <Footer />

      {/* Story overlays */}
      {story && <ServiceStory key={story.id} service={story} onClose={() => setStory(null)} />}
      {article && <ArticleReader key={article.id} article={article} onClose={() => setArticle(null)} />}
    </div>
  );
}
