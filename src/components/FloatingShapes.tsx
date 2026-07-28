import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   AMR AI — 3D Floating Geometric Shapes
   Floating icosahedrons, torus knots & octahedrons
   that react to scroll and mouse movement
   ═══════════════════════════════════════════════════════════ */

const SHAPE_COUNT = 12;

interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  type: "icosahedron" | "torus" | "octahedron";
}

function FloatingShape({ data, mouseRef, scrollRef }: {
  data: ShapeData;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = useRef(data.position[1]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mesh = meshRef.current;

    // Float animation
    mesh.position.y = initialY.current + Math.sin(t * data.speed + data.position[0]) * 0.5;
    mesh.position.x = data.position[0] + Math.cos(t * data.speed * 0.7) * 0.3;

    // Mouse parallax influence
    const mx = mouseRef.current.x * 0.5;
    const my = mouseRef.current.y * 0.3;
    mesh.rotation.x = data.rotation[0] + t * 0.2 + my * 0.5;
    mesh.rotation.y = data.rotation[1] + t * 0.3 + mx * 0.5;
    mesh.rotation.z = data.rotation[2] + t * 0.1;

    // Scroll-based scale pulse
    const scrollPulse = 1 + Math.sin(scrollRef.current * 0.01 + data.position[0]) * 0.1;
    mesh.scale.setScalar(data.scale * scrollPulse);
  });

  const geometry = useMemo(() => {
    switch (data.type) {
      case "icosahedron":
        return new THREE.IcosahedronGeometry(0.4, 0);
      case "torus":
        return new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8);
      case "octahedron":
        return new THREE.OctahedronGeometry(0.35, 0);
      default:
        return new THREE.IcosahedronGeometry(0.4, 0);
    }
  }, [data.type]);

  return (
    <mesh ref={meshRef} geometry={geometry} position={data.position}>
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.7}
        wireframe
      />
    </mesh>
  );
}

function ShapeScene({ mouseRef, scrollRef }: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const shapes = useMemo<ShapeData[]>(() => {
    const colors = ["#29abe2", "#5fd4ff", "#7b6cff", "#ffd166", "#0a5f8f"];
    const types: ShapeData["type"][] = ["icosahedron", "torus", "octahedron"];

    return Array.from({ length: SHAPE_COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6 - 3,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.5 + Math.random() * 0.8,
      speed: 0.3 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#5fd4ff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#7b6cff" />
      {shapes.map((shape, i) => (
        <FloatingShape key={i} data={shape} mouseRef={mouseRef} scrollRef={scrollRef} />
      ))}
    </>
  );
}

export default function FloatingShapes() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[6] pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ShapeScene mouseRef={mouseRef} scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
