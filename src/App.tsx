import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis, getLenis } from "./lib/scroll";
import useScrollReveal from "./hooks/useScrollReveal";
import { useScrollVelocity } from "./hooks/useScrollVelocity";
import Preloader from "./components/Preloader";
import EnhancedCursor from "./components/EnhancedCursor";
import ParticleField from "./components/ParticleField";
import FloatingShapes from "./components/FloatingShapes";
import RippleEffect from "./components/RippleEffect";
import HorizontalShowcase from "./components/HorizontalShowcase";
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

export default function App() {
  const [ready, setReady] = useState(false);
  const [story, setStory] = useState<Service | null>(null);
  const [article, setArticle] = useState<Article | null>(null);

  /* Scroll reveal animations */
  useScrollReveal();

  /* Scroll velocity tracking */
  useScrollVelocity();

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

  return (
    <div className="relative">
      {/* Global effects */}
      <EnhancedCursor />
      <ParticleField />
      <FloatingShapes />
      <RippleEffect />
      <div className="grain-layer" aria-hidden="true" />
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Nav />

      <main>
        <Hero ready={ready} />
        <Marquee items={MARQUEE_ITEMS} />
        <Services onOpenStory={setStory} />
        <HorizontalShowcase />
        <Cases />
        <Tools />
        <Marquee items={["+500 مشروع ناجح", "98% رضا العملاء", "12+ سنة خبرة", "+350% نمو مبيعات", "رد خلال 24 ساعة"]} reverse />
        <Blog onOpen={setArticle} />
        <Pricing />
        <Contact />
      </main>

      <Footer />

      {/* الطبقات السردية */}
      {story && <ServiceStory key={story.id} service={story} onClose={() => setStory(null)} />}
      {article && <ArticleReader key={article.id} article={article} onClose={() => setArticle(null)} />}
    </div>
  );
}
