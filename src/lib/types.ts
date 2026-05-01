// ============================================================
// Yi I Ching Browser — TypeScript Type Definitions
// ============================================================

export type Wuxing = 'jin' | 'mu' | 'shui' | 'huo' | 'tu';
export type Position = 'inner' | 'outer';

export type RelationType = 'cuo' | 'zong' | 'hu' | 'tong';

// ----------------------------------------------------------
// Core I Ching data (static, embedded)
// ----------------------------------------------------------

export interface GuaBase {
  num: number;           // 1-64
  name: string;          // e.g. '乾'
  pinyin: string;        // e.g. 'qian'
  wuxing: Wuxing;        // 五行
  binary: string;         // 6-char binary string e.g. '111111'
  guaci: string;         // 卦辞
  yaoci: string[];       // 6 条爻辞，从初爻到上爻
}

export interface GuaWithMedia extends GuaBase {
  key: string;           // e.g. 'gua_01_qian'
  images: string[];       // absolute paths e.g. '/yi/assets/gua_01_qian/images/...'
  music: string[];        // absolute paths
  lyrics: string[];       // absolute paths
  voice: string[];        // absolute paths
}

// ----------------------------------------------------------
// Relations
// ----------------------------------------------------------

export interface GuaRelation {
  type: RelationType;
  label: string;         // e.g. '错卦'
  gua: GuaBase | null;   // null if relation doesn't exist
}

// ----------------------------------------------------------
// UI State
// ----------------------------------------------------------

export interface FilterState {
  search: string;
  wuxing: Wuxing | 'all';
}

export interface ModalState {
  open: boolean;
  guaKey: string | null;
}

export interface ImmersionState {
  active: boolean;
  guaKey: string | null;
  relType: RelationType | null;  // which relation is highlighted
  journeyIndex: number;          // for 64-gua journey mode
  journeyActive: boolean;
}
