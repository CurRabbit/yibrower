'use client';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative" style={{ width: '200px', flexShrink: 0 }}>
      {/* Subtle outer glow when focused */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
        id="search-glow"
        style={{ opacity: 0, boxShadow: '0 0 0 3px rgba(212,168,67,0.12)' }}
      />
      <div className="relative flex items-center">
        {/* Search icon */}
        <span
          className="absolute left-3.5 text-sm pointer-events-none"
          style={{ color: 'var(--ink-faint)', transition: 'color 0.2s' }}
          id="search-icon"
        >
          ⊛
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索卦名、拼音…"
          className="w-full rounded-full text-sm transition-all"
          style={{
            padding: '7px 16px 7px 32px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(180,150,80,0.14)',
            color: 'var(--ink)',
            outline: 'none',
            letterSpacing: '0.02em',
          }}
          onFocus={(e) => {
            const glow = document.getElementById('search-glow');
            const icon = document.getElementById('search-icon');
            if (glow) glow.style.opacity = '1';
            if (icon) (icon as HTMLElement).style.color = 'var(--gold)';
            e.target.style.borderColor = 'rgba(212,168,67,0.38)';
            e.target.style.background = 'rgba(255,255,255,0.07)';
            e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.2)';
          }}
          onBlur={(e) => {
            const glow = document.getElementById('search-glow');
            const icon = document.getElementById('search-icon');
            if (glow) glow.style.opacity = '0';
            if (icon) (icon as HTMLElement).style.color = 'var(--ink-faint)';
            e.target.style.borderColor = 'rgba(180,150,80,0.14)';
            e.target.style.background = 'rgba(255,255,255,0.04)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {/* Clear button */}
        {value && (
          <button
            className="absolute right-3 text-xs rounded-full flex items-center justify-center cursor-pointer transition-all"
            style={{
              color: 'var(--ink-faint)',
              background: 'rgba(180,150,80,0.1)',
              width: 16,
              height: 16,
              fontSize: '10px',
              lineHeight: 1,
            }}
            onClick={() => onChange('')}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = 'var(--ink)';
              (e.target as HTMLElement).style.background = 'rgba(180,150,80,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = 'var(--ink-faint)';
              (e.target as HTMLElement).style.background = 'rgba(180,150,80,0.1)';
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
