import { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text3D, Center, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { COMPANY } from '../lib/data';

/* ═══════════════════════════════════════════════════════════
   HERO — Cinematic 3D Space Scene with floating text,
   particles, and scroll-driven camera movement
   ═══════════════════════════════════════════════════════════ */

/* ── 3D Floating Particles Ring ─────────────────────────── */
function ParticleRing({ count = 2000, radius = 8 }: { count?: number; radius?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 1.5);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Cyan to violet gradient
      const t = Math.random();
      colors[i * 3] = 0.17 + t * 0.3;     // R
      colors[i * 3 + 1] = 0.67 + t * 0.2; // G
      colors[i * 3 + 2] = 0.9 + t * 0.1;  // B
    }
    return { pos, colors };
  }, [count, radius]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Floating 3D Text ───────────────────────────────────── */
function FloatingTitle({ text, position, size = 1, color = '#5fd4ff' }: {
  text: string;
  position: [number, number, number];
  size?: number;
  color?: string;
}) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Center position={position}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={size}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </Float>
  );
}

/* ── Distorted Sphere (Core) ────────────────────────────── */
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  return (
    <mesh ref={meshRef} scale={1.5}>
      <icosahedronGeometry args={[1, 8]} />
      <MeshDistortMaterial
        color="#0a5f8f"
        emissive="#29abe2"
        emissiveIntensity={0.2}
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

/* ── Glowing Orbs ───────────────────────────────────────── */
function OrbitingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const orbs = useMemo(() => [
    { radius: 3, speed: 0.5, color: '#29abe2', size: 0.15 },
    { radius: 4, speed: 0.3, color: '#7b6cff', size: 0.12 },
    { radius: 5, speed: 0.2, color: '#5fd4ff', size: 0.1 },
    { radius: 3.5, speed: 0.4, color: '#ffd166', size: 0.08 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(orb.speed * 0 + i * 1.5) * orb.radius,
            Math.sin(i) * 0.5,
            Math.sin(orb.speed * 0 + i * 1.5) * orb.radius,
          ]}
        >
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
          <pointLight color={orb.color} intensity={1} distance={3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Camera Controller — scroll-driven ──────────────────── */
function CameraRig({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // Camera pulls back and tilts as user scrolls
    const progress = Math.min(scrollY / window.innerHeight, 1);
    camera.position.z = 8 + progress * 4;
    camera.position.y = -progress * 2;
    camera.rotation.x = progress * 0.1;
  });
  return null;
}

/* ── Main Hero Component ────────────────────────────────── */
export default function Hero({ onReady }: { onReady: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Track scroll for camera
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      onReady();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onReady]);

  // Text reveal animation
  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title-line',
        { y: 100, opacity: 0, rotateX: 45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.3 }
      );
      gsap.fromTo('.hero-subtitle',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
      );
      gsap.fromTo('.hero-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.2 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '200vh' }}
    >
      {/* Sticky 3D Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Three.js Background */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <CameraRig scrollY={scrollY} />
              <ambientLight intensity={0.2} />
              <pointLight position={[10, 10, 10]} intensity={0.5} color="#5fd4ff" />
              <pointLight position={[-10, -10, -5]} intensity={0.3} color="#7b6cff" />

              <ParticleRing count={3000} radius={10} />
              <CoreSphere />
              <OrbitingOrbs />
              <Stars radius={50} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.5} />

              <Environment preset="night" />
              <fog attach="fog" args={['#030309', 10, 25]} />
            </Suspense>
          </Canvas>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4" style={{ perspective: '1000px' }}>
          {/* Company badge */}
          <div className="hero-subtitle mb-6 flex items-center gap-3 opacity-0">
            <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #29abe2)' }} />
            <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#29abe2', fontFamily: 'Space Grotesk' }}>
              {COMPANY.name}
            </span>
            <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, #29abe2, transparent)' }} />
          </div>

          {/* Main Title */}
          <h1 className="text-center" style={{ transformStyle: 'preserve-3d' }}>
            <div className="hero-title-line opacity-0 overflow-hidden">
              <span
                className="block font-black leading-none"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw + 1rem, 7rem)',
                  color: '#eef3fb',
                  textShadow: '0 0 60px rgba(41,171,226,0.3), 0 0 120px rgba(41,171,226,0.1)',
                }}
              >
                نحوّل الأفكار
              </span>
            </div>
            <div className="hero-title-line opacity-0 overflow-hidden">
              <span
                className="block font-black leading-none"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw + 1rem, 7rem)',
                  background: 'linear-gradient(120deg, #fff 20%, #5fd4ff 55%, #7b6cff 90%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                إلى واقعٍ رقميٍ ذكي
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle opacity-0 mt-8 text-center max-w-xl"
            style={{
              fontSize: 'clamp(1rem, 1vw + 0.5rem, 1.3rem)',
              color: '#9aa5bc',
              lineHeight: 1.8,
            }}
          >
            أكثر من 500 مشروع ناجح · 98% رضا عملاء · 12+ سنة خبرة
            <br />
            في الذكاء الاصطناعي وتطوير الويب والأتمتة الذكية
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta opacity-0 mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#services"
              className="group relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all duration-500 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #29abe2, #1b7fd4)',
                color: '#02121e',
                boxShadow: '0 8px 30px rgba(41,171,226,0.35)',
              }}
            >
              <span className="relative z-10">اكتشف خدماتنا</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #7ee0ff, #29abe2)' }}
              />
            </a>
            <a
              href="#contact"
              className="group px-8 py-4 rounded-full font-bold text-lg border transition-all duration-500 hover:scale-105"
              style={{
                borderColor: 'rgba(149,190,255,0.3)',
                color: '#eef3fb',
                background: 'rgba(149,190,255,0.04)',
                backdropFilter: 'blur(12px)',
              }}
            >
              تواصل معنا
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
            <span className="text-xs tracking-widest uppercase" style={{ color: '#5b6579', fontFamily: 'Space Grotesk' }}>
              Scroll
            </span>
            <div className="w-[1px] h-12 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background: 'linear-gradient(180deg, #29abe2, transparent)',
                  animation: 'scrollPulse 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(3,3,9,0.6) 100%)',
          }}
        />
      </div>

      {/* Scroll-triggered spacer */}
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}
