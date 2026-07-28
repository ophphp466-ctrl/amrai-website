/* ═══════════════════════════════════════════════════════════
   AMR AI — Neural Genesis Shader
   A living neural network: brain-like synaptic connections
   that pulse and glow. The mouse is the "attention" vector.
   ═══════════════════════════════════════════════════════════ */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uMouseAct;
out vec4 fragColor;

/* ── hash / noise ───────────────────────────────────────── */
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
             mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.03 + vec2(3.7, 1.3);
    a *= 0.5;
  }
  return v;
}

/* ── synaptic network (brain-like connections) ──────────── */
vec3 synapseNetwork(vec2 uv, float t) {
  // Organic grid — not perfect squares, slightly warped
  float scale = 6.0;
  vec2 g = uv * scale;
  vec2 warp = vec2(fbm(g * 0.3 + t * 0.1), fbm(g * 0.3 + vec2(5.2, 1.3) - t * 0.08));
  g += warp * 0.4;
  
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  
  float dots = 0.0;
  float lines = 0.0;
  float signal = 0.0;
  
  // Find closest nodes and connections
  float minDist = 999.0;
  vec2 closest = vec2(0.0);
  
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 c = id + vec2(float(x), float(y));
      vec2 h = hash22(c);
      
      // Node position with organic movement
      vec2 nodePos = h * 0.35 + 0.05 * vec2(sin(t * 0.4 + h.x * 6.28), cos(t * 0.35 + h.y * 6.28));
      vec2 delta = f - nodePos;
      float d = length(delta);
      
      if (d < minDist) {
        minDist = d;
        closest = c;
      }
      
      // Node glow
      float nodeSize = 0.04 + 0.02 * sin(t * 0.6 + h.x * 6.28);
      dots += smoothstep(nodeSize, 0.0, d) * (0.5 + 0.5 * sin(t * 0.8 + h.y * 6.28));
      
      // Connections to neighbors (synapses)
      if (x == 0 && y == 0) continue;
      
      vec2 nc = c + vec2(float(x), float(y));
      vec2 nh = hash22(nc);
      vec2 nPos = nh * 0.35 + 0.05 * vec2(sin(t * 0.4 + nh.x * 6.28), cos(t * 0.35 + nh.y * 6.28));
      
      // Only connect some pairs (threshold based on hash)
      float connectThresh = hash21(c * 17.31 + nc * 23.77);
      if (connectThresh > 0.35) continue;
      
      // Line segment distance
      vec2 a = nodePos;
      vec2 b = nPos;
      vec2 pa = f - a;
      vec2 ba = b - a;
      float h2 = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
      float ld = length(pa - ba * h2);
      
      // Signal traveling along the line
      float signalPos = fract(t * 0.15 + hash21(c * 7.0) * 2.0);
      float signalDist = abs(h2 - signalPos);
      float sigGlow = exp(-signalDist * signalDist * 80.0) * 0.5;
      
      float lw = 0.008 + sigGlow * 0.01;
      lines += smoothstep(lw, 0.0, ld) * (0.15 + sigGlow);
      signal += sigGlow * smoothstep(lw * 2.0, 0.0, ld);
    }
  }
  
  // Cyan for nodes, brighter cyan for signals
  vec3 nodeCol = vec3(0.16, 0.65, 0.95) * dots * 0.8;
  vec3 lineCol = vec3(0.12, 0.45, 0.75) * lines;
  vec3 signalCol = vec3(0.4, 0.85, 1.0) * signal * 1.5;
  
  return nodeCol + lineCol + signalCol;
}

/* ── deep space fog ─────────────────────────────────────── */
float deepFog(vec2 uv, float t) {
  float f = fbm(uv * 0.8 + t * 0.03);
  f += fbm(uv * 1.5 - t * 0.02) * 0.5;
  return f * 0.15;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.1;
  
  // Mouse influence — attention vector
  vec2 m = uMouse;
  float md = length(uv - m);
  float attention = exp(-md * 2.0) * uMouseAct;
  
  // Deep space background
  vec3 bg = vec3(0.012, 0.014, 0.035);
  bg += vec3(0.02, 0.06, 0.12) * deepFog(uv, t);
  
  // Neural network layer
  vec3 neural = synapseNetwork(uv + (uv - m) * attention * 0.2, t);
  
  // Mouse glow
  bg += vec3(0.1, 0.4, 0.7) * attention * 0.15;
  
  // Combine
  vec3 col = bg + neural;
  
  // Vignette
  float vig = smoothstep(1.6, 0.5, length(uv * vec2(0.8, 1.0)));
  col *= mix(0.4, 1.0, vig);
  
  // Subtle tone map
  col = col / (col + 0.6);
  col = pow(col, vec3(0.92));
  
  fragColor = vec4(col, 1.0);
}
`;

export class HeroShader {
  private gl: WebGL2RenderingContext | null = null;
  private raf = 0;
  private start = performance.now();
  private mouse = { x: 0, y: 0, tx: 0, ty: 0, act: 0, tact: 0 };
  private running = false;
  private canvas: HTMLCanvasElement;
  private onVisibility: () => void;
  private onResize: () => void;
  private onMove: (e: PointerEvent) => void;
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private uRes: WebGLUniformLocation | null = null;
  private uTime: WebGLUniformLocation | null = null;
  private uMouse: WebGLUniformLocation | null = null;
  private uMouseAct: WebGLUniformLocation | null = null;
  private scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
  private frames = 0;
  private lastFpsCheck = performance.now();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.onResize = () => this.resize();
    this.onMove = (e: PointerEvent) => {
      const r = this.canvas.getBoundingClientRect();
      const s = Math.min(r.width, r.height);
      this.mouse.tx = ((e.clientX - r.left) * 2 - r.width) / s;
      this.mouse.ty = -(((e.clientY - r.top) * 2 - r.height) / s);
      this.mouse.tact = 1;
    };
    this.onVisibility = () => {
      if (document.hidden) this.stop();
      else this.play();
    };
  }

  init(): boolean {
    const gl = this.canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return false;
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.uRes = gl.getUniformLocation(prog, "uRes");
    this.uTime = gl.getUniformLocation(prog, "uTime");
    this.uMouse = gl.getUniformLocation(prog, "uMouse");
    this.uMouseAct = gl.getUniformLocation(prog, "uMouseAct");

    window.addEventListener("resize", this.onResize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    this.resize();
    this.play();
    return true;
  }

  private resize() {
    const w = Math.floor(this.canvas.clientWidth * this.scale);
    const h = Math.floor(this.canvas.clientHeight * this.scale);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = Math.max(w, 2);
      this.canvas.height = Math.max(h, 2);
      this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private adaptQuality() {
    this.frames++;
    const now = performance.now();
    const elapsed = now - this.lastFpsCheck;
    if (elapsed > 2200) {
      const fps = (this.frames * 1000) / elapsed;
      this.frames = 0;
      this.lastFpsCheck = now;
      if (fps < 30 && this.scale > 0.5) {
        this.scale = Math.max(0.5, this.scale - 0.1);
        this.resize();
      }
    }
  }

  private frame = () => {
    if (!this.running || !this.gl) return;
    const gl = this.gl;
    const t = (performance.now() - this.start) / 1000;
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;
    this.mouse.act += (this.mouse.tact - this.mouse.act) * 0.03;
    this.mouse.tact *= 0.995;

    gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uTime, t);
    gl.uniform2f(this.uMouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.uMouseAct, this.mouse.act);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.adaptQuality();
    if (!this.reduced) this.raf = requestAnimationFrame(this.frame);
  };

  play() {
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.frame);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
  destroy() {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}
