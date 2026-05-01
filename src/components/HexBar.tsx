'use client';

import type { GuaBase } from '@/lib/types';
import { getGuaKey } from '@/components/HexGrid';
import { WX_COLOR } from '@/data/wuxing-map';

interface HexBarProps {
  gua: GuaBase;
  className?: string;
}

export default function HexBar({ gua, className = '' }: HexBarProps) {
  const key = getGuaKey(gua);
  const wuxingColor = WX_COLOR[gua.wuxing];
  const imageSrc = `/yi/assets/${key}/images/${key}.png`;

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${wuxingColor}20`,
        boxShadow: `0 0 20px ${wuxingColor}10, inset 0 0 20px ${wuxingColor}05`,
      }}
    >
      {/* Gua name */}
      <div
        className="text-center py-2.5 text-sm font-serif tracking-wide"
        style={{
          color: 'var(--gold-bright)',
          borderBottom: `1px solid ${wuxingColor}15`,
          background: `${wuxingColor}06`,
        }}
      >
        {gua.name}
      </div>

      {/* Gua image */}
      <div className="p-3 flex justify-center">
        <img
          src={imageSrc}
          alt={`${gua.name} 卦象`}
          className="h-28 w-auto object-contain"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback: text yao lines */}
        <div
          className="flex-col gap-0.5"
          style={{ display: 'none' }}
        >
          {[5, 4, 3, 2, 1, 0].map((i) => {
            const isYang = gua.binary[i] === '1';
            return (
              <div key={i} className="flex items-center justify-center h-7">
                <div
                  className="relative w-20 h-1.5 rounded-sm"
                  style={{ backgroundColor: isYang ? '#f0c86a' : '#6b5d4d' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Binary code */}
      <div
        className="text-center pb-2.5 text-xs font-mono tracking-[0.2em]"
        style={{ color: 'var(--ink-faint)' }}
      >
        {gua.binary}
      </div>
    </div>
  );
}
