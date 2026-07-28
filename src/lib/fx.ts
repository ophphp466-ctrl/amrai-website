/* ═══════════════════════════════════════════════════════════
   مكتبة التأثيرات المشتركة — تقسيم نصوص + آلة كاتبة للكود
   ═══════════════════════════════════════════════════════════ */

/** يقسم نص العنصر إلى أسطر/كلمات مغلفة للأنيميشن */
export function splitLines(el: HTMLElement): HTMLSpanElement[] {
  const words = el.textContent?.trim().split(/\s+/) ?? [];
  el.innerHTML = words
    .map((w) => `<span class="rv-line"><span>${w}</span></span>`)
    .join(" ");
  return Array.from(el.querySelectorAll<HTMLSpanElement>(".rv-line > span"));
}

/* ── تلوين صياغة خفيف بالتعابير النمطية ─────────────────── */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlight(code: string, lang: string): string {
  let out = esc(code);
  // تعليقات
  if (lang === "html" || lang === "css") {
    out = out.replace(/(&lt;!--[\s\S]*?--&gt;)/g, `<span class="tok-c">$1</span>`);
  } else {
    out = out.replace(/(#[^\n]*)/g, `<span class="tok-c">$1</span>`);
    out = out.replace(/(\/\/[^\n]*)/g, `<span class="tok-c">$1</span>`);
  }
  // نصوص
  out = out.replace(/(&quot;[^&]*?&quot;|"[^"\n]*"|'[^'\n]*')/g, `<span class="tok-s">$1</span>`);
  if (lang === "html") {
    out = out.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, `$1<span class="tok-t">$2</span>`);
    out = out.replace(/([a-zA-Z-]+)=(&quot;|")/g, `<span class="tok-a">$1</span>=$2`);
  } else {
    out = out.replace(
      /\b(const|let|var|function|return|import|from|export|default|class|def|if|else|elif|for|while|in|of|new|await|async|try|except|with|as|print|None|True|False|self|lambda|not|and|or|pass|raise|interface|type|extends|implements)\b/g,
      `<span class="tok-k">$1</span>`
    );
    out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, `<span class="tok-n">$1</span>`);
    out = out.replace(/([a-zA-Z_]\w*)(?=\()/g, `<span class="tok-f">$1</span>`);
  }
  return out;
}

export interface TyperHandle {
  done: Promise<void>;
  skip: () => void;
  cancel: () => void;
}

/**
 * آلة كاتبة سينمائية: تكتب الكود تدريجيًا مع تلوين حي.
 * تكتب كتلًا من الأحرف في كل إطار لسرعة سينمائية واقعية.
 */
export function typeCode(
  el: HTMLElement,
  code: string,
  lang: string,
  opts: { cps?: number; onProgress?: (p: number) => void } = {}
): TyperHandle {
  const cps = opts.cps ?? 340; // أحرف/ثانية
  let i = 0;
  let skipped = false;
  let cancelled = false;
  let last = performance.now();
  let carry = 0;
  let raf = 0;

  const render = () => {
    const chunk = code.slice(0, i);
    el.innerHTML = highlight(chunk, lang) + `<span class="caret"></span>`;
    el.scrollTop = el.scrollHeight;
    opts.onProgress?.(i / code.length);
  };

  const finish = (resolve: () => void) => {
    el.innerHTML = highlight(code, lang);
    el.scrollTop = el.scrollHeight;
    opts.onProgress?.(1);
    resolve();
  };

  const done = new Promise<void>((resolve) => {
    const tick = (now: number) => {
      if (cancelled) return;
      if (skipped) { finish(resolve); return; }
      const dt = Math.min(now - last, 100);
      last = now;
      carry += (cps * dt) / 1000;
      const step = Math.floor(carry);
      if (step > 0) {
        carry -= step;
        i = Math.min(i + step, code.length);
        render();
      }
      if (i >= code.length) { finish(resolve); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  return {
    done,
    skip: () => { skipped = true; },
    cancel: () => { cancelled = true; cancelAnimationFrame(raf); },
  };
}
