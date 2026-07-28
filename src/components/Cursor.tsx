import { useEffect, useRef } from "react";

/* مؤشر مخصص: نقطة + حلقة مغناطيسية بتسمية سياقية */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    let visible = false;

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!visible) { visible = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      if (t) {
        const txt = t.dataset.cursorLabel || "";
        ring.classList.add("is-hover");
        ring.classList.toggle("has-label", !!txt);
        label.textContent = txt;
        // سحب مغناطيسي خفيف
        const r = t.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        t.style.transition = "transform .35s cubic-bezier(.16,1,.3,1)";
        t.style.transform = `translate(${(x - cx) * 0.18}px, ${(y - cy) * 0.18}px)`;
      }
    };
    const out = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      if (t) {
        t.style.transform = "";
        ring.classList.remove("is-hover", "has-label");
        label.textContent = "";
      }
    };

    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }}>
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
