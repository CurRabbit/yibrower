'use client';

import { useState } from 'react';
import type { GuaBase } from '@/lib/types';
import { getGuaKey } from '@/components/HexGrid';
import { WX_COLOR, WX_MAP, WX_BG } from '@/data/wuxing-map';
import { getCuo, getZong, getRelationGua, REL_LABELS } from '@/lib/relations';
import HexBar from '@/components/HexBar';
import Gallery from '@/components/Gallery';
import AudioPlayer from '@/components/AudioPlayer';

interface GuaDetailProps {
  gua: GuaBase;
  onClose: () => void;
  onImmersion: () => void;
  className?: string;
}

type TabKey = 'guaci' | 'yaoci' | 'gallery' | 'music';

const YAO_LABELS = ['初', '二', '三', '四', '五', '上'];

export default function GuaDetail({ gua, onClose, onImmersion, className = '' }: GuaDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('guaci');

  const key = getGuaKey(gua);
  const wuxingColor = WX_COLOR[gua.wuxing];
  const wuxingBg = WX_BG[gua.wuxing];

  const cuoNum = getCuo(gua.num);
  const zongNum = getZong(gua.num);
  const huGua = getRelationGua(gua.num, 'hu');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'guaci', label: '卦辞', icon: '✦' },
    { key: 'yaoci', label: '爻辞', icon: '☰' },
    { key: 'gallery', label: '图库', icon: '◈' },
    { key: 'music', label: '音乐', icon: '◉' },
  ];

  return (
    <div
      className={`relative w-full max-w-5xl rounded-3xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(160deg, #1e1915 0%, #161210 100%)',
        border: '1px solid rgba(212,168,67,0.22)',
        boxShadow: '0 32px 100px rgba(0,0,0,0.85), 0 0 80px rgba(212,168,67,0.08), inset 0 1px 0 rgba(212,168,67,0.1)',
        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top accent line with wuxing color */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${wuxingColor}88, transparent)`,
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-6"
        style={{ borderBottom: '1px solid rgba(180,150,80,0.08)', paddingLeft: '12px' }}
      >
        <div className="flex items-center gap-5">
          {/* Gua image */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ background: wuxingBg, border: `1px solid ${wuxingBg.replace('0.12', '0.3')}` }}
          >
            <img
              src={`/yi/assets/${key}/images/${key}.png`}
              alt={gua.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl text-gold-bright font-serif leading-none">{gua.name}</h2>
              <span className="text-xl text-ink-light font-serif">{gua.pinyin}</span>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${wuxingColor}18`,
                  color: wuxingColor,
                  border: `1px solid ${wuxingColor}35`,
                }}
              >
                {WX_MAP[gua.wuxing]}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-ink-faint">
              <span>第 {gua.num} 卦</span>
              <span className="font-mono tracking-widest text-gold-dim">{gua.binary}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onImmersion}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #b83a28, #8c2a1a)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(184,58,40,0.3)',
            }}
          >
            <span>◈</span> 沉浸体验
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--ink-faint)',
              border: '1px solid rgba(180,150,80,0.1)',
            }}
            aria-label="关闭"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-5 p-6">
        {/* Left — HexBar */}
        <div className="w-44 flex-shrink-0 flex flex-col gap-4">
          <HexBar gua={gua} className="w-full" />

          {/* Relation卦 */}
          <div>
            <div className="text-[11px] text-ink-faint uppercase tracking-widest mb-2">关系卦</div>
            <div className="flex flex-col gap-1.5">
              <RelationTag label={REL_LABELS.cuo} num={cuoNum} color={wuxingColor} />
              <RelationTag label={REL_LABELS.zong} num={zongNum} color={wuxingColor} />
              {huGua && (
                <RelationTag label={REL_LABELS.hu} name={huGua.name} color={wuxingColor} />
              )}
            </div>
          </div>

          {/* Wuxing accent */}
          <div
            className="rounded-xl p-3 text-center"
            style={{
              background: `${wuxingColor}0a`,
              border: `1px solid ${wuxingColor}20`,
            }}
          >
            <div className="text-[10px] text-ink-faint tracking-widest mb-1">五行</div>
            <div className="text-lg font-serif" style={{ color: wuxingColor }}>
              {WX_MAP[gua.wuxing]}
            </div>
          </div>
        </div>

        {/* Right — Tabs */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab nav */}
          <div className="flex gap-1 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all"
                style={
                  activeTab === tab.key
                    ? {
                        background: `linear-gradient(135deg, ${wuxingColor}20, ${wuxingColor}10)`,
                        color: wuxingColor,
                        border: `1px solid ${wuxingColor}35`,
                      }
                    : {
                        background: 'rgba(255,255,255,0.03)',
                        color: 'var(--ink-faint)',
                        border: '1px solid rgba(180,150,80,0.06)',
                      }
                }
              >
                <span className="text-xs">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            className="flex-1 rounded-2xl overflow-hidden tab-content-enter"
            style={{
              background: 'rgba(10,8,6,0.7)',
              border: `1px solid ${wuxingColor}12`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <TabContent gua={gua} activeTab={activeTab} wuxingColor={wuxingColor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RelationTag({ label, num, name, color }: { label: string; num?: number; name?: string; color: string }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 rounded-xl text-sm"
      style={{
        background: `${color}0a`,
        border: `1px solid ${color}20`,
      }}
    >
      <span className="text-ink-faint text-xs">{label}</span>
      <span className="text-gold text-xs font-mono">{num ? num : name}</span>
    </div>
  );
}

function TabContent({ gua, activeTab, wuxingColor }: { gua: GuaBase; activeTab: TabKey; wuxingColor: string }) {
  if (activeTab === 'guaci') {
    return (
      <div className="relative h-full flex items-center justify-center p-10">
        {/* Corner ornaments */}
        {['╔', '╗', '╚', '╝'].map((char, i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              color: wuxingColor,
              top: i < 2 ? 16 : undefined,
              bottom: i >= 2 ? 16 : undefined,
              left: i === 0 || i === 2 ? 16 : undefined,
              right: i === 1 || i === 3 ? 16 : undefined,
            }}
          >
            {char}
          </span>
        ))}
        {/* Divider lines */}
        <div
          className="absolute left-1/2 top-8 bottom-8 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${wuxingColor}30 20%, ${wuxingColor}30 80%, transparent)`,
          }}
        />
        {/* Content */}
        <div className="relative z-10 text-center max-w-xs">
          <div
            className="text-[10px] tracking-[0.4em] mb-6 uppercase opacity-40"
            style={{ color: wuxingColor }}
          >
            周易 · {gua.name}
          </div>
          <p
            className="text-[1.35rem] font-serif leading-[2.2] indent-8"
            style={{
              color: 'var(--gold-pale)',
              textShadow: `0 0 30px ${wuxingColor}40`,
            }}
          >
            {gua.guaci}
          </p>
          <div
            className="mt-8 mx-auto w-24 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${wuxingColor}60, transparent)`,
            }}
          />
          <div
            className="mt-3 text-xs tracking-widest opacity-30"
            style={{ color: wuxingColor }}
          >
            {gua.pinyin} · 第{gua.num}卦
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'yaoci') {
    const upper = gua.yaoci.slice(0, 3); // 初、二、三
    const lower = gua.yaoci.slice(3, 6); // 四、五、上

    return (
      <div className="h-full flex flex-col">
        {/* Section labels */}
        <div className="flex px-6 pt-5 pb-3 gap-4">
          <div className="flex-1 text-center">
            <span className="text-[10px] tracking-widest text-ink-faint">下卦 · 内</span>
            <div
              className="mt-1 mx-auto w-8 h-px"
              style={{ background: `${wuxingColor}30` }}
            />
          </div>
          <div className="w-px" style={{ background: `${wuxingColor}15` }} />
          <div className="flex-1 text-center">
            <span className="text-[10px] tracking-widest text-ink-faint">上卦 · 外</span>
            <div
              className="mt-1 mx-auto w-8 h-px"
              style={{ background: `${wuxingColor}30` }}
            />
          </div>
        </div>

        {/* Yaoci rows — two columns */}
        <div className="flex-1 flex gap-0 px-5 pb-5 overflow-auto">
          {/* Lower (inner) */}
          <div className="flex-1 flex flex-col gap-2 pr-3">
            {lower.map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl transition-all"
                style={{
                  background: `${wuxingColor}08`,
                  border: `1px solid ${wuxingColor}15`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: `${wuxingColor}15`,
                    color: wuxingColor,
                    border: `1px solid ${wuxingColor}30`,
                  }}
                >
                  {YAO_LABELS[3 + i]}
                </div>
                <p className="text-[13px] leading-[1.75] text-ink-light">{text}</p>
              </div>
            ))}
          </div>

          <div className="w-px self-stretch my-2" style={{ background: `${wuxingColor}10` }} />

          {/* Upper (outer) */}
          <div className="flex-1 flex flex-col gap-2 pl-3">
            {upper.map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl transition-all"
                style={{
                  background: `${wuxingColor}08`,
                  border: `1px solid ${wuxingColor}15`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: `${wuxingColor}15`,
                    color: wuxingColor,
                    border: `1px solid ${wuxingColor}30`,
                  }}
                >
                  {YAO_LABELS[2 - i]}
                </div>
                <p className="text-[13px] leading-[1.75] text-ink-light">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'gallery') {
    return (
      <div className="p-4">
        <Gallery gua={gua} className="w-full h-72" />
      </div>
    );
  }

  if (activeTab === 'music') {
    return (
      <div className="p-5">
        <AudioPlayer gua={gua} className="w-full" />
      </div>
    );
  }

  return null;
}
