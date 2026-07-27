/* ═══════════════════════════════════════════════════════════
   AMR AI — Enhanced Hero GLSL Scene v2
   Immersive aurora + neural network + chromatic aberration
   + digital rain particles + volumetric god rays
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

/* ── noise utilities ────────────────────────────────────── */
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
  float v = 0.0, a = 0.55;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.03 + vec2(3.7, 1.3);
    a *= 0.52;
  }
  return v;
}

/* ── neural network ─────────────────────────────────────── */
vec2 nodePos(vec2 cell, float t) {
  vec2 h = hash22(cell);
  return cell + 0.5 + 0.38 * vec2(sin(t * 0.6 + h.x * 6.28), cos(t * 0.45 + h.y * 6.28));
}
vec3 network(vec2 uv, float t) {
  vec2 g = uv * 9.0;
  vec2 id = floor(g);
  float dots = 0.0, lines = 0.0;
  vec2 p0 = nodePos(id, t);
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 c = id + vec2(x, y);
    vec2 p = nodePos(c, t);
    float d = length(g - p);
    dots += 0.0018 / (d * d + 0.004);
    if (x == 0 || y == 0) {
      vec2 a = p0, b = p;
      vec2 pa = g - a, ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
      float ld = length(pa - ba * h);
      float w = smoothstep(1.9, 0.4, length(b - a));
      lines += smoothstep(0.035, 0.0, ld) * w * 0.55;
    }
  }
  return vec3(0.16, 0.65, 0.95) * dots * 0.5 + vec3(0.10, 0.45, 0.85) * lines * 0.4;
}

/* ── digital rain particles ─────────────────────────────── */
float rain(vec2 uv, float t) {
  float rain = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 seed = vec2(fi * 37.0, fi * 17.0);
    float x = hash21(seed) * 2.0 - 1.0;
    float speed = 0.3 + hash21(seed + 1.0) * 0.5;
    float y = fract(x * 0.7 + t * speed + fi * 0.1);
    float len = 0.02 + hash21(seed + 2.0) * 0.04;
    float bright = hash21(seed + 3.0);
    vec2 drop = vec2(x, y * 2.0 - 1.0);
    float d = length(uv - drop);
    rain += bright * smoothstep(len, 0.0, abs(d)) * smoothstep(0.0, 0.1, y) * smoothstep(1.0, 0.9, y);
  }
  return rain;
}

/* ── god rays / volumetric light ────────────────────────── */
float godRays(vec2 uv, float t) {
  float rays = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = fi * 2.4 + t * 0.05;
    vec2 dir = vec2(cos(angle), sin(angle));
    float d = dot(uv, dir);
    rays += pow(max(d * 0.5 + 0.5, 0.0), 8.0) * 0.08;
  }
  return rays;
}

/* ── chromatic aberration helper ────────────────────────── */
vec3 sampleScene(vec2 uv, float t) {
  /* mouse warp */
  vec2 m = uMouse;
  float md = length(uv - m);
  float mGlow = exp(-md * 2.6) * uMouseAct;
  vec2 warp = (uv - m) * mGlow * 0.35;

  /* aurora — domain-warped fbm */
  vec2 p = uv * 1.15 + warp;
  vec2 q = vec2(fbm(p + t * 0.7), fbm(p + vec2(5.2, 1.3) - t * 0.5));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + t * 0.35),
                fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.28));
  float f = fbm(p + 2.6 * r);

  /* palette — OLED navy → cyan → violet → gold */
  vec3 base = vec3(0.012, 0.014, 0.035);
  vec3 c1   = vec3(0.02, 0.10, 0.24);
  vec3 c2   = vec3(0.05, 0.45, 0.75);
  vec3 c3   = vec3(0.34, 0.28, 0.85);
  vec3 c4   = vec3(0.95, 0.82, 0.40);
  vec3 col = base;
  col = mix(col, c1, smoothstep(0.15, 0.65, f));
  col = mix(col, c2, smoothstep(0.45, 0.95, f) * 0.85);
  col = mix(col, c3, smoothstep(0.6, 1.0, length(q)) * 0.35);
  col = mix(col, c4, smoothstep(0.75, 1.0, f) * 0.15);
  col += c2 * pow(max(f - 0.55, 0.0), 2.2) * 1.6;
  col += vec3(0.35, 0.75, 1.0) * mGlow * 0.22;

  /* neural layer */
  float centerMask = smoothstep(0.35, 1.15, length(uv * vec2(0.75, 1.2)));
  col += network(uv + warp * 0.5, uTime) * mix(0.5, 1.0, centerMask);

  /* digital rain */
  float r = rain(uv * 1.5, t * 0.5);
  col += vec3(0.18, 0.65, 0.95) * r * 0.3;

  /* god rays */
  col += vec3(0.02, 0.08, 0.15) * godRays(uv, t);

  /* scanlines + grain */
  col *= 0.96 + 0.04 * sin(gl_FragCoord.y * 1.7);
  col += (hash21(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.028;

  /* vignette */
  float vig = smoothstep(1.85, 0.45, length(uv * vec2(0.85, 1.1)));
  col *= mix(0.55, 1.0, vig);

  /* tone map */
  col = col / (col + 0.55);
  col = pow(col, vec3(0.9));

  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.12;

  /* chromatic aberration at edges */
  float aberration = length(uv) * 0.003;
  vec3 col;
  col.r = sampleScene(uv + vec2(aberration, 0.0), t).r;
  col.g = sampleScene(uv, t).g;
  col.b = sampleScene(uv - vec2(aberration, 0.0), t).b;

  /* subtle pulse on mouse interaction */
  float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
  col += vec3(0.02, 0.06, 0.1) * uMouseAct * pulse * 0.3;

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
  private scale = Math.min(window.devicePixelRatio || 1, 1.6) * 0.85;
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
      if (fps < 27 && this.scale > 0.45) {
        this.scale = Math.max(0.45, this.scale - 0.15);
        this.resize();
      }
    }
  }

  private frame = () => {
    if (!this.running || !this.gl) return;
    const gl = this.gl;
    const t = (performance.now() - this.start) / 1000;
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.045;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.045;
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
