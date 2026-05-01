'use client';

import type { Wuxing } from '@/lib/types';
import { WX_MAP, WX_COLOR } from '@/data/wuxing-map';

type FilterValue = 'all' | Wuxing;

const TABS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: '全' },
  { value: 'jin', label: WX_MAP.jin },
  { value: 'mu', label: WX_MAP.mu },
  { value: 'shui', label: WX_MAP.shui },
  { value: 'huo', label: WX_MAP.huo },
  { value: 'tu', label: WX_MAP.tu },
];

export default function WuxingFilter({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 items-center">
      {TABS.map((tab) => {
        const isActive = active === tab.value;
        const color = tab.value === 'all' ? 'var(--ink-light)' : WX_COLOR[tab.value as Wuxing];
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className="relative px-2.5 py-1 rounded text-[11px] cursor-pointer transition-all duration-200 overflow-hidden flex-shrink-0"
            style={
              isActive
                ? {
                    background: tab.value === 'all'
                      ? 'rgba(212,168,67,0.12)'
                      : `${color}22`,
                    color: tab.value === 'all'
                      ? 'var(--gold-bright)'
                      : color,
                    border: tab.value === 'all'
                      ? '1px solid rgba(212,168,67,0.65)'
                      : `1px solid ${color}90`,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    boxShadow: tab.value === 'all'
                      ? '0 0 20px rgba(212,168,67,0.35), 0 0 40px rgba(212,168,67,0.15), inset 0 1px 0 rgba(255,255,255,0.10)'
                      : `0 0 22px ${color}50, 0 0 40px ${color}20, inset 0 1px 0 ${color}30`,
                    transform: 'scale(1.05)',
                  }
                : {
                    background: 'rgba(255,255,255,0.02)',
                    color: 'rgba(180,150,80,0.25)',
                    border: '1px solid rgba(180,150,80,0.08)',
                    letterSpacing: '0.04em',
                    fontWeight: 500,
                    transform: 'scale(1)',
                  }
            }
          >
            {isActive && tab.value !== 'all' && (
              <span
                className="absolute inset-0 rounded"
                style={{
                  background: `linear-gradient(135deg, ${color}18 0%, transparent 55%)`,
                  pointerEvents: 'none',
                }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
