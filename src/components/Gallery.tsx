'use client';

import { useState } from 'react';
import type { GuaBase } from '@/lib/types';
import { getGuaKey } from '@/components/HexGrid';

interface GalleryProps {
  gua: GuaBase;
  className?: string;
}

export default function Gallery({ gua, className = '' }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const key = getGuaKey(gua);

  // getGuaKey 返回完整 key 如 "gua_01_qian"，无需再加前缀
  const guaKey = key; // e.g. "gua_01_qian"
  const images = [
    `/yi/assets/${guaKey}/images/${guaKey}.png`,
    `/yi/assets/${guaKey}/images/${guaKey}_2026-04-28.png`,
    `/yi/assets/${guaKey}/images/${guaKey}_2026-04-29.png`,
  ];

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setLoading(true);
  };

  const next = () => {
    setCurrentIndex((next) => (next === images.length - 1 ? 0 : next + 1));
    setLoading(true);
  };

  return (
    <div className={`relative w-full h-64 bg-surface rounded-xl overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`${gua.name} 图库 ${currentIndex + 1}`}
        className="w-full h-full object-contain"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
        aria-label="上一张"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
        aria-label="下一张"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i);
              setLoading(true);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-gold' : 'bg-white/40'
            }`}
            aria-label={`第 ${i + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
