import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════
   Enhanced Cursor — Trail effect + magnetic snap
   ═══════════════════════════════════════════════════════════ */

export default function EnhancedCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])
  const posRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 })
  const trailPosRef = useRef(Array.from({ length: 6 }, () => ({ x: 0, y: 0 })))
  
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    
    let visible = false
    let raf = 0
    
    const move = (e: PointerEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        trailRefs.current.forEach(t => t && (t.style.opacity = '0.4'))
      }
    }
    
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]')
      if (t) {
        const txt = t.dataset.cursorLabel || ''
        ring.classList.add('is-hover')
        ring.classList.toggle('has-label', !!txt)
        const label = ring.querySelector('.cursor-label') as HTMLElement
        if (label) label.textContent = txt
        
        const r = t.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        t.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1)'
        t.style.transform = `translate(${(posRef.current.x - cx) * 0.18}px, ${(posRef.current.y - cy) * 0.18}px)`
      }
    }
    
    const out = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]')
      if (t) {
        t.style.transform = ''
        ring.classList.remove('is-hover', 'has-label')
        const label = ring.querySelector('.cursor-label') as HTMLElement
        if (label) label.textContent = ''
      }
    }
    
    const loop = () => {
      const { x, y } = posRef.current
      posRef.current.rx += (x - posRef.current.rx) * 0.16
      posRef.current.ry += (y - posRef.current.ry) * 0.16
      
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${posRef.current.rx}px, ${posRef.current.ry}px) translate(-50%,-50%)`
      
      // Update trail positions
      trailPosRef.current.forEach((pos, i) => {
        const targetX = i === 0 ? posRef.current.rx : trailPosRef.current[i - 1].x
        const targetY = i === 0 ? posRef.current.ry : trailPosRef.current[i - 1].y
        pos.x += (targetX - pos.x) * (0.15 - i * 0.02)
        pos.y += (targetY - pos.y) * (0.15 - i * 0.02)
        
        const trail = trailRefs.current[i]
        if (trail) {
          trail.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%) scale(${1 - i * 0.12})`
          trail.style.opacity = String(0.35 - i * 0.05)
        }
      })
      
      raf = requestAnimationFrame(loop)
    }
    
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerout', out, { passive: true })
    
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
    }
  }, [])
  
  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el }}
          className="fixed top-0 left-0 z-[999] pointer-events-none rounded-full"
          style={{
            width: `${28 - i * 3}px`,
            height: `${28 - i * 3}px`,
            border: '1.5px solid rgba(95, 212, 255, 0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
      
      {/* Main dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[1000] pointer-events-none rounded-full"
        style={{
          width: '7px',
          height: '7px',
          background: '#5fd4ff',
          boxShadow: '0 0 12px rgba(95,212,255,0.9), 0 0 24px rgba(95,212,255,0.4)',
          opacity: 0,
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[1000] pointer-events-none rounded-full flex items-center justify-center cursor-ring-enhanced"
        style={{
          width: '38px',
          height: '38px',
          border: '1.5px solid rgba(95, 212, 255, 0.5)',
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s ease, border-color 0.35s ease',
        }}
      >
        <span className="cursor-label" style={{
          fontFamily: 'var(--font-ar)',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#02121e',
          opacity: 0,
          transition: 'opacity 0.25s ease',
          whiteSpace: 'nowrap',
        }} />
      </div>
      
      <style>{`
        .cursor-ring-enhanced.is-hover {
          width: 64px !important;
          height: 64px !important;
          background: rgba(95, 212, 255, 0.12) !important;
          border-color: #5fd4ff !important;
        }
        .cursor-ring-enhanced.has-label {
          width: 84px !important;
          height: 84px !important;
          background: #5fd4ff !important;
          border-color: #5fd4ff !important;
        }
        .cursor-ring-enhanced.has-label .cursor-label {
          opacity: 1 !important;
        }
        @media (hover: none), (pointer: coarse) {
          .cursor-ring-enhanced, .cursor-ring-enhanced ~ div { display: none !important; }
        }
      `}</style>
    </>
  )
}
