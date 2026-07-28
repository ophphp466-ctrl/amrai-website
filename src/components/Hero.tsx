import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { COMPANY } from '../lib/data';

/* ═══════════════════════════════════════════════════════════
   HERO — Film Reel Section 1
   WebGL Noise Shader Background + Split Text Animation
   ═══════════════════════════════════════════════════════════ */

/* ── WebGL Noise Shader ─────────────────────────────────── */
const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 p = uv * 3.0;
    
    // Mouse influence
    vec2 mouse = u_mouse / u_res;
    float mouseDist = length(uv - mouse);
    
    // Animated noise
    float t = u_time * 0.15;
    float n1 = fbm(p + t);
    float n2 = fbm(p * 1.5 - t * 0.7 + 10.0);
    float n3 = fbm(p * 0.5 + t * 0.3 + 20.0);
    
    // Colors
    vec3 c1 = vec3(0.012, 0.012, 0.035);  // Deep space
    vec3 c2 = vec3(0.04, 0.06, 0.13);     // Dark blue
    vec3 c3 = vec3(0.16, 0.67, 0.89);     // Cyan
    vec3 c4 = vec3(0.48, 0.42, 1.0);      // Violet
    
    // Mix colors based on noise
    vec3 col = mix(c1, c2, n1);
    col = mix(col, c3, n2 * 0.15 * (1.0 - mouseDist));
    col = mix(col, c4, n3 * 0.08 * smoothstep(0.5, 0.0, mouseDist));
    
    // Add subtle glow near center
    float centerDist = length(uv - 0.5);
    col += c3 * smoothstep(0.5, 0.0, centerDist) * 0.03;
    
    // Vignette
    col *= 1.0 - smoothstep(0.3, 1.0, centerDist) * 0.5;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function initShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false })!;
  if (!gl) return null;

  // Compile shaders
  function compile(type: number, src: string) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // Fullscreen quad
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  let mouseX = 0, mouseY = 0;
  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = canvas.height - e.clientY;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  let raf = 0;
  let startTime = performance.now();
  let running = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  function render() {
    if (!running) return;
    const t = (performance.now() - startTime) / 1000;
    gl.uniform1f(uTime, t);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouseX * (canvas.width / canvas.clientWidth), mouseY * (canvas.height / canvas.clientHeight));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(render);
  }
  raf = requestAnimationFrame(render);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    }
  };
}

/* ── Split Text Animation ───────────────────────────────── */
function SplitText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('.split-char');
    gsap.fromTo(chars,
      { y: 120, opacity: 0, rotateX: -80 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power4.out',
        delay,
      }
    );
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ perspective: '800px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char inline-block"
          style={{ transformStyle: 'preserve-3d', whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

/* ── Magnetic Button ────────────────────────────────────── */
function MagneticButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-shadow duration-500"
      style={{
        background: primary
          ? 'linear-gradient(135deg, #29abe2, #1b7fd4)'
          : 'rgba(149,190,255,0.04)',
        color: primary ? '#02121e' : '#eef3fb',
        border: primary ? 'none' : '1px solid rgba(148,178,255,0.2)',
        backdropFilter: primary ? 'none' : 'blur(12px)',
        boxShadow: primary ? '0 8px 30px rgba(41,171,226,0.35)' : 'none',
        willChange: 'transform',
      }}
    >
      <span className="relative z-10">{children}</span>
    </a>
  );
}

/* ── Main Hero Component ────────────────────────────────── */
export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const shader = initShader(canvasRef.current);
    return () => shader?.destroy();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-reel-section
      className="relative h-screen w-full overflow-hidden"
    >
      {/* WebGL Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,3,9,0.7) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Badge */}
        <div data-reel-text className="flex items-center gap-4 mb-8 opacity-0">
          <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #29abe2)' }} />
          <span className="text-sm font-medium tracking-[0.3em] uppercase" style={{ color: '#29abe2', fontFamily: 'Space Grotesk' }}>
            {COMPANY.name}
          </span>
          <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, #29abe2, transparent)' }} />
        </div>

        {/* Main Title — Split Text */}
        <div data-reel-visual className="text-center opacity-0">
          <SplitText
            text="نحوّل الأفكار"
            className="block font-black leading-none"
            delay={0.5}
          />
          <SplitText
            text="إلى واقعٍ رقميٍ ذكي"
            className="block font-black leading-none mt-2"
            delay={0.8}
          />
          <style>{`
            .split-char {
              font-size: clamp(2.5rem, 5vw + 1rem, 7rem);
              background: linear-gradient(120deg, #fff 20%, #5fd4ff 55%, #7b6cff 90%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
          `}</style>
        </div>

        {/* Subtitle */}
        <p
          data-reel-text
          className="mt-8 text-center max-w-xl opacity-0"
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
        <div data-reel-visual className="mt-10 flex flex-wrap gap-4 justify-center opacity-0">
          <MagneticButton href="#services" primary>
            اكتشف خدماتنا
          </MagneticButton>
          <MagneticButton href="#contact">
            تواصل معنا
          </MagneticButton>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
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

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}
