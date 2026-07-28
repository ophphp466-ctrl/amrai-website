import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Hero from './components/Hero';
import Services from './components/Services';
import Cases from './components/Cases';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  /* ── Lenis smooth scroll ──────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  /* ── Global scroll reveal ─────────────────────────────── */
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Sections fade in
      gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [ready]);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#030309' }}>
      {/* Film grain */}
      <div className="grain-layer" aria-hidden="true" />

      <main>
        <Hero onReady={() => setReady(true)} />
        <Services />
        <Cases />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
