import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   AMR AI — 3D Neural Network Visualization
   Interactive nodes with glowing connections
   ═══════════════════════════════════════════════════════════ */

interface NodeData {
  position: THREE.Vector3;
  id: number;
  label: string;
  accent: string;
}

function NeuralNode({ position, accent, onHover, id }: {
  position: THREE.Vector3;
  accent: string;
  onHover: (id: number | null) => void;
  id: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position.y + Math.sin(t * 0.5 + id * 0.7) * 0.08;

    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2 + id) * 0.15;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const color = useMemo(() => new THREE.Color(accent), [accent]);

  const handleOver = useCallback(() => {
    setHovered(true);
    onHover(id);
  }, [id, onHover]);

  const handleOut = useCallback(() => {
    setHovered(false);
    onHover(null);
  }, [onHover]);

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <mesh
        ref={meshRef}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <sphereGeometry args={[hovered ? 0.14 : 0.09, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.003, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function NeuralConnection({ start, end, active }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  active: boolean;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3(
        (start.x + end.x) / 2 + (Math.sin(start.x * 3) * 0.2),
        (start.y + end.y) / 2 + (Math.cos(end.y * 2) * 0.2),
        (start.z + end.z) / 2 + 0.1
      ),
      end
    );
    const points = curve.getPoints(30);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);

  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.elapsedTime;
    materialRef.current.opacity = active
      ? 0.5 + Math.sin(t * 4) * 0.25
      : 0.04 + Math.sin(t * 0.8) * 0.02;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#29abe2"
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function SignalPulse({ start, end, speed = 1, delay = 0 }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed?: number;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = ((state.clock.elapsedTime * speed + delay) % 1);
    meshRef.current.position.lerpVectors(start, end, t);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.sin(t * Math.PI) * 0.7;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#5fd4ff" transparent opacity={0} />
    </mesh>
  );
}

function Scene({ services, hoveredNode }: { services: any[]; hoveredNode: number | null }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const result: NodeData[] = [];
    const cols = 3;
    const spacing = 2.2;

    services.forEach((s, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      result.push({
        position: new THREE.Vector3(
          (col - 1) * spacing,
          (1 - row) * spacing * 0.8,
          (Math.sin(i * 1.3) * 0.3)
        ),
        id: i,
        label: s.title,
        accent: s.accent || "#29abe2"
      });
    });
    return result;
  }, [services]);

  const connections = useMemo(() => {
    const result: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 3.5 && Math.random() > 0.2) {
          result.push([i, j]);
        }
      }
    }
    return result;
  }, [nodes]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
  });

  const setHoveredNode = useCallback((id: number | null) => {
    // Handled by parent
  }, []);

  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <NeuralNode
          key={node.id}
          position={node.position}
          id={node.id}
          accent={node.accent}
          onHover={setHoveredNode}
        />
      ))}

      {connections.map(([a, b], i) => (
        <NeuralConnection
          key={`conn-${i}`}
          start={nodes[a].position}
          end={nodes[b].position}
          active={hoveredNode === a || hoveredNode === b}
        />
      ))}

      {connections.slice(0, 12).map(([a, b], i) => (
        <SignalPulse
          key={`pulse-${i}`}
          start={nodes[a].position}
          end={nodes[b].position}
          speed={0.3 + Math.random() * 0.4}
          delay={i * 0.3}
        />
      ))}
    </group>
  );
}

export default function NeuralNetwork3D({ services }: { services: any[] }) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div className="w-full h-[55vh] md:h-[75vh] relative rounded-3xl overflow-hidden border border-[#94b2ff15]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#030309"]} />
        <fog attach="fog" args={["#030309", 8, 18]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#29abe2" />
        <pointLight position={[-5, -3, -5]} intensity={0.2} color="#7b6cff" />

        <Scene services={services} hoveredNode={hoveredNode} />

        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Floating labels */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-[90%]">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[11px] font-bold"
            style={{ borderColor: `${s.accent}33` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent }} />
            {s.title}
          </div>
        ))}
      </div>

      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
        style={{ background: "radial-gradient(circle at 100% 0%, rgba(41,171,226,0.1), transparent 70%)" }} />
    </div>
  );
}
