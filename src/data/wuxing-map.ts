// ============================================================
// Wuxing (Five Elements) Color and Label Mapping
// ============================================================

import type { Wuxing } from '@/lib/types';

export const WX_MAP: Record<Wuxing, string> = {
  jin: '金',
  mu: '木',
  shui: '水',
  huo: '火',
  tu: '土',
};

export const WX_COLOR: Record<Wuxing, string> = {
  jin: '#c8961e',
  mu: '#5a8c5a',
  shui: '#4a7c9b',
  huo: '#b84a2d',
  tu: '#7a6c3a',
};

export const WX_BG: Record<Wuxing, string> = {
  jin: 'rgba(200,150,30,0.12)',
  mu: 'rgba(90,140,90,0.12)',
  shui: 'rgba(74,124,155,0.12)',
  huo: 'rgba(184,74,45,0.12)',
  tu: 'rgba(122,108,58,0.12)',
};

export const WX_BORDER: Record<Wuxing, string> = {
  jin: 'rgba(200,150,30,0.25)',
  mu: 'rgba(90,140,90,0.25)',
  shui: 'rgba(74,124,155,0.25)',
  huo: 'rgba(184,74,45,0.25)',
  tu: 'rgba(122,108,58,0.25)',
};

export const ALL_WUXING: Wuxing[] = ['jin', 'mu', 'shui', 'huo', 'tu'];
