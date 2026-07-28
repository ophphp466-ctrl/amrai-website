/* ═══════════════════════════════════════════════════════════
   AMR AI — Cinematic Atmosphere Background
   A living aurora of deep cyan and midnight tones.
   Pure generative art — no external assets.
   ═══════════════════════════════════════════════════════════ */

const AURORA_VERT = `attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}`;

const AURORA_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

#define PI 3.14159265359

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}

float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}

float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<5;i++){
    v+=a*noise(p);
    p*=2.03;a*=.5;
  }
  return v;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy*2.-uRes)/min(uRes.x,uRes.y);
  float t=uTime*.08;

  // Mouse influence
  vec2 m=(uMouse*2.-1.)*.3;

  // Aurora-like flowing gradients
  float n1=fbm(vec2(p.x*1.5+m.x,p.y*.8+t));
  float n2=fbm(vec2(p.x*2.-t*.5,p.y*1.2+m.y));
  float n3=fbm(vec2(p.x*.7+t*.3,p.y*1.5));

  // Color mixing — deep midnight cyan
  vec3 c1=vec3(.01,.015,.04);   // deep space
  vec3 c2=vec3(.02,.08,.18);    // dark cyan
  vec3 c3=vec3(.04,.15,.35);    // mid cyan
  vec3 c4=vec3(.08,.35,.55);    // bright cyan edge

  vec3 col=mix(c1,c2,n1);
  col=mix(col,c3,n2*.6);
  col+=c4*n3*.15;

  // Vertical light beam from top
  float beam=exp(-p.x*p.x*3.)*exp(-p.y*1.5);
  col+=vec3(.05,.2,.4)*beam*.3;

  // Subtle horizontal band
  float band=smoothstep(.3,.7,uv.y)*smoothstep(.9,.5,uv.y);
  col+=vec3(.02,.12,.25)*band*.15;

  // Mouse glow
  float md=length(p-m);
  col+=vec3(.1,.4,.7)*exp(-md*md*4.)*.08;

  // Vignette
  float vig=1.-dot(p*.5,p*.5);
  col*=smoothstep(-.5,1.,vig);

  // Tone map
  col=col/(col+.7);
  col=pow(col,vec3(.9));

  gl_FragColor=vec4(col,1.);
}
`;

export class CinematicAtmosphere {
  private gl: WebGLRenderingContext | null = null;
  private raf = 0;
  private start = performance.now();
  private mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  private canvas: HTMLCanvasElement;
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  init(): boolean {
    const gl = this.canvas.getContext("webgl", {
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
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, AURORA_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, AURORA_FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.uLoc("uRes");
    this.uLoc("uTime");
    this.uLoc("uMouse");

    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    this.resize();
    this.play();
    return true;
  }

  private uLoc(name: string): WebGLUniformLocation | null {
    return this.gl!.getUniformLocation(this.gl!.getParameter(this.gl!.CURRENT_PROGRAM), name);
  }

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.floor(this.canvas.clientWidth * dpr);
    const h = Math.floor(this.canvas.clientHeight * dpr);
    this.canvas.width = w; this.canvas.height = h;
    this.gl?.viewport(0, 0, w, h);
  };

  private onMove = (e: PointerEvent) => {
    this.mouse.tx = e.clientX / window.innerWidth;
    this.mouse.ty = 1 - e.clientY / window.innerHeight;
  };

  private frame = () => {
    if (!this.running || !this.gl) return;
    const gl = this.gl;
    const t = (performance.now() - this.start) / 1000;
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.02;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.02;

    gl.uniform2f(this.uLoc("uRes"), this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uLoc("uTime"), t);
    gl.uniform2f(this.uLoc("uMouse"), this.mouse.x, this.mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.raf = requestAnimationFrame(this.frame);
  };

  play() { if (!this.running) { this.running = true; this.raf = requestAnimationFrame(this.frame); } }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  destroy() {
    this.stop();
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onMove);
  }
}
