"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 1200);
        this.y = Math.random() * (canvas?.height ?? 800);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = -(Math.random() * 0.3 + 0.1);
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.25 + 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -10 || this.x < -10 || this.x > (canvas?.width ?? 1200) + 10) {
          this.y = canvas?.height ?? 800;
          this.x = Math.random() * (canvas?.width ?? 1200);
        }
      }

      draw() {
        if (!ctx) return;
        const color = (window as unknown as Record<string, string>).__atm_color ?? '#c8961e';
        const m = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        const r = m ? parseInt(m[1], 16) : 200;
        const g = m ? parseInt(m[2], 16) : 150;
        const b = m ? parseInt(m[3], 16) : 30;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
        ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }, () => new Particle());

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      raf = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.5,
      }}
    />
  );
}
