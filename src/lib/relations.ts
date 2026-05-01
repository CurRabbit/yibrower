// ============================================================
// Gua Relations (错卦/综卦/互卦)
// ============================================================

import type { RelationType } from "@/lib/types";
import { GUA_DATA } from "@/data/gua-data";

/** 错卦：64 - num（阴阳全变） */
export function getCuo(num: number): number {
  return 65 - num;
}

/** 综卦：64 - num（上下互易） */
export function getZong(num: number): number {
  return 65 - num;
}

export const REL_LABELS: Record<RelationType, string> = {
  cuo: '错卦',
  zong: '综卦',
  hu: '互卦',
  tong: '五行同',
};

export function getRelationGua(num: number, type: RelationType) {
  const target = type === 'cuo' ? getCuo(num) : getZong(num);
  return GUA_DATA.find((g) => g.num === target) ?? null;
}

/** 五行相同的卦列表（排除自己） */
export function getSameWuxing(wuxing: string, num: number) {
  return GUA_DATA.filter((g) => g.wuxing === wuxing && g.num !== num);
}
