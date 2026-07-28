import { useEffect, useState } from "react";
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

  useEffect(() => {
    const lenis = initLenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); };
  }, []);

  useEffect(() => {
    if (ready) setTimeout(() => ScrollTrigger.refresh(), 300);
  }, [ready]);

  useEffect(() => {
    const lenis = getLenis();
    if (!ready) { lenis?.stop(); document.body.style.overflow = "hidden"; }
    else { lenis?.start(); document.body.style.overflow = ""; }
  }, [ready]);

  return (
    <div className="relative bg-[#030309] overflow-x-hidden">
      <Preloader onDone={() => setReady(true)} />

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

      {story && <ServiceStory key={story.id} service={story} onClose={() => setStory(null)} />}
      {article && <ArticleReader key={article.id} article={article} onClose={() => setArticle(null)} />}
    </div>
  );
}
