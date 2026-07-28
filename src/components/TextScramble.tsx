import { useEffect, useRef, useState } from 'react'

/* ═══════════════════════════════════════════════════════════
   Text Scramble Effect — Cinematic character decode
   ═══════════════════════════════════════════════════════════ */

const CHARS = '!<>-_\\/[]{}—=+*^?#________أبتثجحخدذرزسشصضطظعغفقكلمنهوي'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
}

export default function TextScramble({ text, className = '', delay = 0 }: TextScrambleProps) {
  const elRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasAnimated = useRef(false)
  
  useEffect(() => {
    const el = elRef.current
    if (!el || hasAnimated.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
          
          let iteration = 0
          const original = text
          const totalIterations = original.length * 3
          
          const interval = setInterval(() => {
            el.innerText = original
              .split('')
              .map((char, index) => {
                if (index < iteration / 3) return original[index]
                if (char === ' ') return ' '
                return CHARS[Math.floor(Math.random() * CHARS.length)]
              })
              .join('')
            
            iteration++
            if (iteration >= totalIterations) {
              clearInterval(interval)
              el.innerText = original
            }
          }, 30)
          
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])
  
  return (
    <span
      ref={elRef}
      className={className}
      style={{ opacity: isVisible ? 1 : 0, transition: `opacity 0.3s ease ${delay}ms` }}
    >
      {text}
    </span>
  )
}
