'use client';

import SearchBar from '@/components/SearchBar';
import WuxingFilter from '@/components/WuxingFilter';
import PositionFilter from '@/components/PositionFilter';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  wuxingActive: string;
  onWuxingChange: (v: string) => void;
  positionActive: string;
  onPositionChange: (v: string) => void;
  trigramActive: string;
  onTrigramChange: (b: string) => void;
  totalGuas?: number;
  themeActive: string;
  onThemeChange: (v: string) => void;
}

export default function Header({
  searchValue,
  onSearchChange,
  wuxingActive,
  onWuxingChange,
  positionActive,
  onPositionChange,
  trigramActive,
  onTrigramChange,
  totalGuas = 64,
  themeActive,
  onThemeChange,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-3 flex-wrap relative"
      style={{
        padding: '10px 24px',
        background: 'rgba(13,10,7,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(180,150,80,0.08)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Gradient fade line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.4) 20%, rgba(212,168,67,0.5) 50%, rgba(212,168,67,0.4) 80%, transparent 100%)',
          animation: wuxingActive !== 'all' || positionActive !== 'all'
            ? 'goldLineGlow 2s ease-in-out infinite'
            : 'none',
          boxShadow: wuxingActive !== 'all' || positionActive !== 'all'
            ? '0 0 8px rgba(212,168,67,0.4)'
            : 'none',
          transition: 'box-shadow 0.5s ease',
        }}
      />

      {/* Logo mark */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.25), rgba(212,168,67,0.08))',
            border: '1px solid rgba(212,168,67,0.3)',
            color: 'var(--gold-bright)',
            boxShadow: '0 0 10px rgba(212,168,67,0.15)',
          }}
        >
          ☷
        </div>
        <span
          className="text-sm font-bold leading-none"
          style={{
            color: 'var(--gold-bright)',
            textShadow: '0 0 15px rgba(212,168,67,0.3)',
            letterSpacing: '0.08em',
          }}
        >
          易经
        </span>
      </div>

      <SearchBar value={searchValue} onChange={onSearchChange} />
      <WuxingFilter active={wuxingActive} onChange={onWuxingChange} />
      <PositionFilter
        active={positionActive}
        onChange={onPositionChange}
        trigram={trigramActive}
        onTrigramChange={onTrigramChange}
      />

      {/* 主题切换 */}
      <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
        {[
          { key: 'default',   label: '金', color: '#c8961e' },
          { key: 'ink',        label: '墨', color: '#6b5d4d' },
          { key: 'celadon',    label: '瓷', color: '#5a8878' },
          { key: 'vermilion',  label: '朱', color: '#9a6840' },
        ].map(({ key, label, color }) => {
          const isActive = themeActive === key;
          return (
            <button
              key={key}
              onClick={() => onThemeChange(key)}
              title={key === 'default' ? '默认金色' : key === 'ink' ? '水墨' : key === 'celadon' ? '青瓷' : '紫禁'}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: isActive
                  ? `1.5px solid ${color}`
                  : '1px solid rgba(180,150,80,0.10)',
                background: isActive
                  ? `${color}18`
                  : 'rgba(255,255,255,0.02)',
                color: isActive ? color : 'var(--ink-faint)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 0 8px ${color}40` : 'none',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <span
        className="ml-auto text-xs flex-shrink-0"
        style={{
          color: 'var(--ink-faint)',
          letterSpacing: '0.1em',
        }}
      >
        {totalGuas} 卦
      </span>
    </header>
  );
}
