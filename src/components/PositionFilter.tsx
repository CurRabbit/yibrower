'use client';

// 八经卦数据：binary → 卦名 + Unicode符号
const TRIGRAMS: { value: string; name: string; symbol: string; bg: string }[] = [
  { value: '111', name: '乾', symbol: '☰', bg: 'rgba(200,150,30,0.15)' },
  { value: '110', name: '兑', symbol: '☱', bg: 'rgba(200,64,40,0.12)' },
  { value: '101', name: '离', symbol: '☲', bg: 'rgba(200,64,40,0.12)' },
  { value: '100', name: '震', symbol: '☳', bg: 'rgba(90,140,90,0.12)' },
  { value: '011', name: '艮', symbol: '☶', bg: 'rgba(122,108,58,0.12)' },
  { value: '010', name: '坎', symbol: '☵', bg: 'rgba(74,124,155,0.12)' },
  { value: '001', name: '巽', symbol: '☴', bg: 'rgba(90,140,90,0.12)' },
  { value: '000', name: '坤', symbol: '☷', bg: 'rgba(122,108,58,0.12)' },
];

type PositionValue = 'all' | 'inner' | 'outer';

const POS_TABS: { value: PositionValue; label: string }[] = [
  { value: 'all', label: '全' },
  { value: 'inner', label: '内' },
  { value: 'outer', label: '外' },
];

interface PositionFilterProps {
  active: string;       // 'all' | 'inner' | 'outer'
  trigram: string;      // 三爻卦 binary，如 '111'
  onChange: (v: string) => void;         // 切换 position
  onTrigramChange: (b: string) => void;  // 切换三爻卦
}

export default function PositionFilter({
  active,
  trigram,
  onChange,
  onTrigramChange,
}: PositionFilterProps) {
  const showTrigrams = active !== 'all';
  const selectedTrigram = TRIGRAMS.find((t) => t.value === trigram);
  const positionLabel = active === 'inner' ? '内卦' : active === 'outer' ? '外卦' : null;

  return (
    <div className="flex items-center gap-2">
      {/* 位置切换：全 / 内 / 外 */}
      <div
        className="relative px-2 py-1 rounded"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(180,150,80,0.08)',
        }}
      >
        {/* 底部细线装饰 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.18), transparent)' }}
        />
        <div className="flex gap-0.5">
          {POS_TABS.map((tab) => {
            const isActive = active === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onChange(tab.value)}
                className="relative px-2 py-0.5 rounded text-[11px] cursor-pointer transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: 'rgba(212,168,67,0.18)',
                        color: 'var(--gold-bright)',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        border: '1px solid rgba(212,168,67,0.65)',
                        boxShadow: '0 0 20px rgba(212,168,67,0.35), 0 0 40px rgba(212,168,67,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                        transform: 'scale(1.08)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.01)',
                        color: 'rgba(180,150,80,0.25)',
                        letterSpacing: '0.04em',
                        border: '1px solid rgba(180,150,80,0.08)',
                        fontWeight: 500,
                        transform: 'scale(1)',
                      }
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 三爻卦选择器：选中了内/外之后才显示 */}
      {showTrigrams && (
        <div className="flex items-center gap-1">
          {/* 位置指示标签 */}
          <span
            className="text-[10px] flex-shrink-0"
            style={{ color: 'var(--ink-faint)', letterSpacing: '0.06em' }}
          >
            {positionLabel}：
          </span>

          {/* 8个卦象按钮 */}
          {TRIGRAMS.map((tri) => {
            const isActive = trigram === tri.value;
            return (
              <button
                key={tri.value}
                onClick={() => onTrigramChange(tri.value)}
                className="relative w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer transition-all duration-150"
                style={
                  isActive
                    ? {
                        background: tri.bg,
                        color: 'var(--gold-bright)',
                        border: '1px solid rgba(212,168,67,0.70)',
                        boxShadow: '0 0 16px rgba(212,168,67,0.50), 0 0 30px rgba(212,168,67,0.25), 0 0 50px rgba(212,168,67,0.10)',
                        fontSize: '14px',
                        transform: 'scale(1.15)',
                        animation: 'trigramPulse 1.8s ease-in-out infinite',
                      }
                    : {
                        background: 'rgba(255,255,255,0.02)',
                        color: 'rgba(180,150,80,0.25)',
                        border: '1px solid rgba(180,150,80,0.08)',
                        fontSize: '13px',
                        transform: 'scale(1)',
                      }
                }
                title={tri.name}
              >
                {tri.symbol}
              </button>
            );
          })}

          {/* 清除按钮 */}
          {selectedTrigram && (
            <button
              onClick={() => onTrigramChange('')}
              className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 ml-0.5 transition-all duration-150"
              style={{
                background: 'rgba(180,150,80,0.08)',
                color: 'var(--ink-faint)',
                fontSize: '9px',
                border: '1px solid rgba(180,150,80,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = 'var(--ink-light)';
                (e.target as HTMLElement).style.background = 'rgba(180,150,80,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'var(--ink-faint)';
                (e.target as HTMLElement).style.background = 'rgba(180,150,80,0.08)';
              }}
              title="清除筛选"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
