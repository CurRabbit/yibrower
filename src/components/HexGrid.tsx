'use client';

import type { GuaBase } from '@/lib/types';
import { WX_COLOR, WX_BG, WX_MAP } from '@/data/wuxing-map';

export function getGuaKey(g: GuaBase): string {
  return `gua_${String(g.num).padStart(2, '0')}_${g.pinyin}`;
}

interface GuaCardProps {
  gua: GuaBase;
  onSelect: (key: string) => void;
  index: number;
}

function GuaCard({ gua, onSelect, index }: GuaCardProps) {
  const key = getGuaKey(gua);
  const wuxingColor = WX_COLOR[gua.wuxing];
  const wuxingBg = WX_BG[gua.wuxing];
  const guaKey = key;
  const imageSrc = `/yi/assets/${guaKey}/images/${guaKey}.png`;

  // 卦象渲染：1=阳爻（实线），0=阴爻（断线）
  const yaoLines = gua.binary.split('').map((b, i) => ({
    isYang: b === '1',
    // 初爻在下，六爻在上，所以要反序
    top: i * 5,
  }));

  return (
    <div
      className="gua-card-enter group cursor-pointer"
      style={{
        animationDelay: `${(index % 8) * 40}ms`,
        animationFillMode: 'both',
      }}
      onClick={() => onSelect(key)}
    >
      <div
        className="relative overflow-hidden transition-all duration-300 group-hover:shadow-hover group-hover:-translate-y-1"
        style={{
          background: `linear-gradient(160deg, ${wuxingBg.replace('0.12', '0.18')}, rgba(22,18,14,0.98))`,
          border: `1px solid ${wuxingBg.replace('0.12', '0.35')}`,
          boxShadow: 'var(--shadow-card)',
          borderRadius: '12px',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Image area */}
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={imageSrc}
            alt={gua.name}
            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.visibility = 'hidden';
            }}
          />
          {/* Wuxing corner badge - moved to avoid overlap */}
          <div
            className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{
              backgroundColor: `${wuxingColor}28`,
              color: wuxingColor,
              border: `1px solid ${wuxingColor}55`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {WX_MAP[gua.wuxing]}
          </div>
        </div>

        {/* Card body — horizontal: 卦序 | 卦名 | 卦象 */}
        <div className="px-2 pb-2 pt-1 flex items-center gap-1">
          {/* 卦序 */}
          <span
            className="font-mono flex-shrink-0 leading-none"
            style={{ color: 'var(--ink-light)', fontSize: '10px', opacity: 0.7 }}
          >
            {String(gua.num).padStart(2, '0')}
          </span>

          {/* 分隔线 */}
          <div className="w-px h-3 flex-shrink-0" style={{ background: `${wuxingColor}55` }} />

          {/* 卦名 */}
          <span
            className="flex-shrink-0 leading-none"
            style={{ color: wuxingColor, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}
          >
            {gua.name}
          </span>

          {/* 卦象: 右对齐，阳爻实线，阴爻两段断线 */}
          <div
            className="relative ml-auto flex-shrink-0"
            style={{ width: 26, height: 30 }}
          >
            {[...gua.binary].reverse().map((b, i) => (
              <div
                key={i}
                className="absolute left-0 right-0"
                style={{
                  top: i * 5,
                }}
              >
                {/* 阳爻：一条实线 */}
                {b === '1' ? (
                  <div
                    className="absolute rounded-sm"
                    style={{
                      left: 0,
                      width: '100%',
                      top: 0,
                      height: 3,
                      background: wuxingColor,
                      boxShadow: `0 0 3px ${wuxingColor}60`,
                    }}
                  />
                ) : (
                  /* 阴爻：左右两条独立短线，中间明显断开 */
                  <>
                    <div
                      className="absolute rounded-sm"
                      style={{
                        left: 0,
                        top: 0.5,
                        width: '40%',
                        height: 2,
                        background: `${wuxingColor}80`,
                      }}
                    />
                    <div
                      className="absolute rounded-sm"
                      style={{
                        right: 0,
                        top: 0.5,
                        width: '40%',
                        height: 2,
                        background: `${wuxingColor}80`,
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HexGridProps {
  guas: GuaBase[];
  onSelect: (key: string) => void;
}

export default function HexGrid({ guas, onSelect }: HexGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
      {guas.map((gua, i) => (
        <GuaCard key={getGuaKey(gua)} gua={gua} onSelect={onSelect} index={i} />
      ))}
    </div>
  );
}
