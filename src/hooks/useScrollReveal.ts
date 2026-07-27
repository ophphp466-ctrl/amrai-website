import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════
   Scroll Reveal Hook — Animate elements on scroll
   ═══════════════════════════════════════════════════════════ */

export default function useScrollReveal() {
  const triggersRef = useRef<ScrollTrigger[]>([])
  
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      // Reveal headings
      document.querySelectorAll<HTMLElement>('.reveal-heading').forEach((el) => {
        gsap.set(el, { opacity: 0, y: 40 })
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          },
          once: true,
        })
        triggersRef.current.push(st)
      })
      
      // Reveal cards with stagger
      document.querySelectorAll<HTMLElement>('.reveal-card').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 50, scale: 0.96 })
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(el, { 
              opacity: 1, y: 0, scale: 1, 
              duration: 0.9, 
              delay: (i % 3) * 0.1,
              ease: 'power3.out' 
            })
          },
          once: true,
        })
        triggersRef.current.push(st)
      })
      
      // Reveal text lines
      document.querySelectorAll<HTMLElement>('.reveal-text').forEach((el) => {
        gsap.set(el, { opacity: 0, y: 30 })
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
          },
          once: true,
        })
        triggersRef.current.push(st)
      })
      
      // Parallax images/elements
      document.querySelectorAll<HTMLElement>('.parallax-slow').forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        })
      })
      
      // Horizontal drift for decorative elements
      document.querySelectorAll<HTMLElement>('.drift-right').forEach((el) => {
        gsap.fromTo(el, 
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      })
      
    }, 100)
    
    return () => {
      clearTimeout(timeout)
      triggersRef.current.forEach(t => t.kill())
      triggersRef.current = []
    }
  }, [])
}
