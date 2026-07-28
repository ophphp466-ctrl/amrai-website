import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Scramble text effect
    const chars = '!<>-_\\/[]{}--=+*^?#________';
    const el = textRef.current;
    if (!el) return;

    let iteration = 0;
    const originalText = el.innerText;
    const interval = setInterval(() => {
      el.innerText = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 8;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 80);

    // Exit animation after loading
    const exitTimer = setTimeout(() => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1,
        ease: 'power4.inOut',
        onComplete,
      });
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{ background: '#030309' }}
    >
      {/* Logo */}
      <div className="relative mb-12">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
          style={{
            background: 'linear-gradient(135deg, #29abe2, #1b7fd4)',
            color: '#02121e',
            boxShadow: '0 0 60px rgba(41,171,226,0.4)',
          }}
        >
          A
        </div>
      </div>

      {/* Scramble text */}
      <div
        ref={textRef}
        className="text-2xl md:text-4xl font-black tracking-wider mb-8"
        style={{
          color: '#eef3fb',
          fontFamily: 'Space Grotesk, monospace',
          textShadow: '0 0 40px rgba(41,171,226,0.3)',
        }}
      >
        Amr AI
      </div>

      {/* Progress bar */}
      <div className="w-64 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(148,178,255,0.1)' }}>
        <div
          ref={progressRef}
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #29abe2, #7b6cff)',
            boxShadow: '0 0 20px rgba(41,171,226,0.5)',
          }}
        />
      </div>

      {/* Progress text */}
      <div className="mt-4 text-sm font-mono" style={{ color: '#5b6579' }}>
        {Math.floor(progress)}%
      </div>

      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(41,171,226,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
