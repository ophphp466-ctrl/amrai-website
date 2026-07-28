import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════
   AMR AI — Immersive Particle Field
   Floating neural particles with mouse attraction + connections
   ═══════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 280
const CONNECTION_DIST = 2.8
const MOUSE_RADIUS = 4.5

interface ParticleSystemProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

function ParticleSystem({ mouseRef }: ParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    
    const brandColors = [
      new THREE.Color('#29abe2'),
      new THREE.Color('#5fd4ff'),
      new THREE.Color('#7b6cff'),
      new THREE.Color('#0a5f8f'),
    ]
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 20
      pos[i3 + 1] = (Math.random() - 0.5) * 20
      pos[i3 + 2] = (Math.random() - 0.5) * 10
      
      vel[i3] = (Math.random() - 0.5) * 0.008
      vel[i3 + 1] = (Math.random() - 0.5) * 0.008
      vel[i3 + 2] = (Math.random() - 0.5) * 0.004
      
      const color = brandColors[Math.floor(Math.random() * brandColors.length)]
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b
    }
    
    return { positions: pos, velocities: vel, colors: col }
  }, [])
  
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    return geo
  }, [positions, colors])
  
  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const linePos = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)
    geo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    return geo
  }, [])
  
  useFrame(() => {
    if (!meshRef.current) return
    
    const posAttr = meshRef.current.geometry.attributes.position
    const posArray = posAttr.array as Float32Array
    const mouse = mouseRef.current
    
    // Update particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      
      // Mouse attraction
      const dx = mouse.x * 10 - posArray[i3]
      const dy = -mouse.y * 10 - posArray[i3 + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < MOUSE_RADIUS) {
        const force = (1 - dist / MOUSE_RADIUS) * 0.015
        velocities[i3] += dx * force
        velocities[i3 + 1] += dy * force
      }
      
      // Apply velocity with damping
      posArray[i3] += velocities[i3]
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2]
      
      velocities[i3] *= 0.98
      velocities[i3 + 1] *= 0.98
      velocities[i3 + 2] *= 0.98
      
      // Boundary wrap
      if (Math.abs(posArray[i3]) > 12) velocities[i3] *= -1
      if (Math.abs(posArray[i3 + 1]) > 12) velocities[i3 + 1] *= -1
      if (Math.abs(posArray[i3 + 2]) > 6) velocities[i3 + 2] *= -1
    }
    
    posAttr.needsUpdate = true
    
    // Update connections
    if (linesRef.current) {
      const linePos = lineGeo.attributes.position.array as Float32Array
      let lineIdx = 0
      
      for (let i = 0; i < PARTICLE_COUNT && lineIdx < linePos.length - 6; i++) {
        const i3 = i * 3
        for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < linePos.length - 6; j++) {
          const j3 = j * 3
          const dx = posArray[i3] - posArray[j3]
          const dy = posArray[i3 + 1] - posArray[j3 + 1]
          const dz = posArray[i3 + 2] - posArray[j3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (dist < CONNECTION_DIST) {
            linePos[lineIdx++] = posArray[i3]
            linePos[lineIdx++] = posArray[i3 + 1]
            linePos[lineIdx++] = posArray[i3 + 2]
            linePos[lineIdx++] = posArray[j3]
            linePos[lineIdx++] = posArray[j3 + 1]
            linePos[lineIdx++] = posArray[j3 + 2]
          }
        }
      }
      
      // Clear remaining
      while (lineIdx < linePos.length) {
        linePos[lineIdx++] = 0
      }
      
      lineGeo.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <>
      <points ref={meshRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial
          color="#29abe2"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  )
}

export default function ParticleField() {
  const mouseRef = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  
  return (
    <div className="fixed inset-0 z-[5] pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ParticleSystem mouseRef={mouseRef} />
      </Canvas>
    </div>
  )
}
