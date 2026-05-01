'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { GuaBase } from '@/lib/types';
import { getGuaKey } from '@/components/HexGrid';
import { WX_COLOR, WX_MAP } from '@/data/wuxing-map';

interface ImmersionViewProps {
  gua: GuaBase;
  onExit: () => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  hue: number; // gold variation
}

export default function ImmersionView({
  gua,
  onExit,
  onPrev,
  onNext,
  className = '',
}: ImmersionViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  const wuxingColor = WX_COLOR[gua.wuxing];
  const wuxingMapVal = WX_MAP[gua.wuxing];
  const key = getGuaKey(gua);
  const imageSrc = `/yi/assets/${key}/images/${key}.png`;

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 160; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.6 + 0.2;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed * 0.3,
        vy: -Math.abs(Math.sin(angle) * speed),
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.05,
        hue: Math.random() * 30 + 35, // gold hue range
      });
    }
    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: w, height: h } = canvas;

    ctx.fillStyle = 'rgba(13,10,7,0.18)';
    ctx.fillRect(0, 0, w, h);

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.003; // gentle upward drift

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const rgb = `hsla(${p.hue}, 70%, 65%, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = rgb;
      ctx.fill();

      // Glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
      glow.addColorStop(0, `hsla(${p.hue}, 70%, 65%, ${p.opacity * 0.25})`);
      glow.addColorStop(1, `hsla(${p.hue}, 70%, 65%, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      style={{ background: 'rgba(13,10,7,0.96)' }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-8">

        {/* Gua image — large centered */}
        <div className="mb-8">
          <img
            src={imageSrc}
            alt={gua.name}
            className="w-64 h-64 object-contain"
            style={{
              filter: `drop-shadow(0 0 40px ${wuxingColor}40)`,
            }}
          />
        </div>

        {/* Gua name */}
        <div className="text-center mb-2">
          <h1
            className="text-6xl font-serif leading-none mb-1"
            style={{
              color: 'var(--gold-bright)',
              textShadow: `0 0 40px ${wuxingColor}50`,
            }}
          >
            {gua.name}
          </h1>
          <p className="text-2xl" style={{ color: 'var(--ink-light)' }}>
            {gua.pinyin} · 第 {gua.num} 卦
          </p>
          <span
            className="inline-block mt-2 px-3 py-1 rounded-full text-sm"
            style={{
              background: `${wuxingColor}18`,
              color: wuxingColor,
              border: `1px solid ${wuxingColor}35`,
            }}
          >
            {wuxingMapVal}
          </span>
        </div>

        {/* Guaci */}
        <p
          className="text-center text-xl font-serif leading-relaxed mt-6 max-w-xl"
          style={{ color: 'var(--ink-light)' }}
        >
          {gua.guaci}
        </p>

        {/* Navigation */}
        <div className="flex items-center gap-8 mt-10">
          <button
            onClick={onPrev}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(180,150,80,0.15)',
              color: 'var(--ink-light)',
            }}
            aria-label="上一卦"
          >
            ◀
          </button>
          <div className="text-center">
            <div className="text-xs text-ink-faint tracking-widest">易经</div>
            <div className="font-mono text-gold text-lg">{gua.num} / 64</div>
          </div>
          <button
            onClick={onNext}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(180,150,80,0.15)',
              color: 'var(--ink-light)',
            }}
            aria-label="下一卦"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Exit — top right */}
      <button
        onClick={onExit}
        className="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(180,150,80,0.12)',
          color: 'var(--ink-faint)',
        }}
        aria-label="退出"
      >
        ×
      </button>
    </div>
  );
}
