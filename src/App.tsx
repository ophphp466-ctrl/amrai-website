import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import Services from './components/Services';
import Cases from './components/Cases';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  /* ── Lenis smooth scroll ──────────────────────────────── */
  useEffect(() => {
    if (loading) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [loading]);

  /* ── Film Reel Scroll — Pinned Sections ───────────────── */
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-reel-section]');

      sections.forEach((section, i) => {
        const visuals = section.querySelectorAll<HTMLElement>('[data-reel-visual]');
        const texts = section.querySelectorAll<HTMLElement>('[data-reel-text]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            snap: {
              snapTo: (progress) => {
                if (progress < 0.2) return 0;
                if (progress > 0.8) return 1;
                return 0.5;
              },
              duration: { min: 0.2, max: 0.5 },
              ease: 'power2.inOut',
            },
          },
        });

        // Entrance
        tl.fromTo(
          visuals,
          { opacity: 0, scale: 0.8, y: 100 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.05 },
          0
        );
        tl.fromTo(
          texts,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.05 },
          0.05
        );

        // Hold (content visible)
        tl.to({}, { duration: 0.4 });

        // Exit
        if (i < sections.length - 1) {
          tl.to(visuals, { opacity: 0, scale: 0.9, y: -80, duration: 0.3, ease: 'power2.in', stagger: 0.03 }, 0.7);
          tl.to(texts, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.in', stagger: 0.03 }, 0.72);
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
    // Refresh ScrollTrigger after loading screen exits
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}

      <div className="relative" style={{ background: '#030309' }}>
        {/* Film grain */}
        <div className="grain-layer" aria-hidden="true" />

        <main ref={mainRef}>
          <Hero />
          <Services />
          <Cases />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
