/* ═══════════════════════════════════════════════════════════
   AMR AI — CINEMATIC ATMOSPHERE
   Deep aurora nebula with flowing light
   ═══════════════════════════════════════════════════════════ */

const VERT = `attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}

float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}

float fbm(vec2 p){
  float v=0.,a=.5;
  mat2 rot=mat2(.8,.6,-.6,.8);
  for(int i=0;i<6;i++){
    v+=a*noise(p);
    p=rot*p*2.03+vec2(3.7,1.3);
    a*=.5;
  }
  return v;
}

float aurora(vec2 uv,float t){
  float y=uv.y*.5+.5;
  float wave=sin(uv.x*3.+t*1.5)*.15;
  wave+=sin(uv.x*5.-t*.8)*.08;
  wave+=sin(uv.x*8.+t*2.)*.04;
  float band=smoothstep(.3,.7,y+wave);
  band*=smoothstep(1.,.6,y);
  return band;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy*2.-uRes)/min(uRes.x,uRes.y);
  float t=uTime*.06;

  // Mouse influence
  vec2 m=uMouse;
  float md=length(p-(m*2.-1.)*.5);
  float mouseGlow=exp(-md*md*2.)*.15;

  // Deep space base
  vec3 col=vec3(.008,.01,.025);

  // Flowing nebula layers
  float n1=fbm(vec2(p.x*1.2+t*.3,p.y*.6+t*.15));
  float n2=fbm(vec2(p.x*1.5-t*.2,p.y*.8-t*.1));
  float n3=fbm(vec2(p.x*.8+t*.4,p.y*1.2));

  // Aurora bands
  float a1=aurora(p+vec2(t*.1,0.),t);
  float a2=aurora(p*1.5+vec2(-t*.15,.2),t*1.3+.5);
  float a3=aurora(p*.7+vec2(t*.08,-.1),t*.7+1.);

  // Color mixing — deep cinematic palette
  vec3 deep=vec3(.01,.015,.04);
  vec3 mid1=vec3(.02,.12,.28);   // teal
  vec3 mid2=vec3(.05,.20,.40);   // cyan
  vec3 bright=vec3(.12,.45,.65); // bright cyan
  vec3 glow=vec3(.20,.65,.90);   // neon

  col=mix(deep,mid1,n1*.8);
  col=mix(col,mid2,n2*.5);
  col+=bright*n3*.2;

  // Aurora layers
  col+=mid1*a1*.4;
  col+=mid2*a2*.3;
  col+=bright*a3*.2;

  // Horizontal light streak
  float streak=exp(-(p.y-.2)*(p.y-.2)*8.)*exp(-p.x*p.x*.5);
  col+=vec3(.08,.25,.45)*streak*.25;

  // Mouse glow
  col+=vec3(.15,.45,.7)*mouseGlow;

  // Stars
  float stars=hash(floor(gl_FragCoord.xy*.7))*.7;
  stars=pow(stars,20.)*2.;
  col+=vec3(.8,.9,1.)*stars;

  // Top glow
  float topGlow=exp(-(p.y-.8)*(p.y-.8)*3.);
  col+=vec3(.04,.18,.35)*topGlow*.3;

  // Vignette
  float vig=1.-dot(p*.4,p*.4);
  col*=smoothstep(-.3,1.,vig);

  // Tone map
  col=col/(col+.6);
  col=pow(col,vec3(.92));

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
  private onResize: () => void;
  private onMove: (e: PointerEvent) => void;
  private onVis: () => void;
  private dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.onResize = () => this.resize();
    this.onMove = (e: PointerEvent) => {
      this.mouse.tx = e.clientX / window.innerWidth;
      this.mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    this.onVis = () => { if (document.hidden) this.stop(); else this.play(); };
  }

  init(): boolean {
    const gl = this.canvas.getContext("webgl", {
      antialias: false, alpha: false, powerPreference: "high-performance",
    });
    if (!gl) return false;
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh));
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
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

    this.uLoc = (name: string) => gl.getUniformLocation(prog, name);

    window.addEventListener("resize", this.onResize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    document.addEventListener("visibilitychange", this.onVis);
    this.resize();
    this.play();
    return true;
  }

  private uLoc(_name: string): WebGLUniformLocation | null { return null; }

  private resize() {
    const w = Math.floor(this.canvas.clientWidth * this.dpr);
    const h = Math.floor(this.canvas.clientHeight * this.dpr);
    this.canvas.width = Math.max(w, 2);
    this.canvas.height = Math.max(h, 2);
    this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private frame = () => {
    if (!this.running || !this.gl) return;
    const gl = this.gl;
    const t = (performance.now() - this.start) / 1000;
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.03;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.03;

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
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("visibilitychange", this.onVis);
  }
}
