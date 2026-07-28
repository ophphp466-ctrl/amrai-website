import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════
   Velocity Skew — Elements skew based on scroll velocity
   ═══════════════════════════════════════════════════════════ */

export default function useVelocitySkew(selector: string, maxSkew = 5) {
  const triggersRef = useRef<ScrollTrigger[]>([])
  
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector)
    if (elements.length === 0) return
    
    let currentSkew = 0
    let targetSkew = 0
    let lastScroll = 0
    let rafId = 0
    
    const updateSkew = () => {
      currentSkew += (targetSkew - currentSkew) * 0.1
      
      elements.forEach(el => {
        el.style.transform = `skewY(${currentSkew}deg)`
      })
      
      targetSkew *= 0.9
      rafId = requestAnimationFrame(updateSkew)
    }
    
    const onScroll = () => {
      const scrollY = window.scrollY
      const velocity = scrollY - lastScroll
      lastScroll = scrollY
      targetSkew = gsap.utils.clamp(-maxSkew, maxSkew, velocity * 0.15)
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(updateSkew)
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      triggersRef.current.forEach(t => t.kill())
    }
  }, [selector, maxSkew])
}
