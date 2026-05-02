/**
 * Yi-Images API client
 * 前端通过 nginx 反向代理访问 /yi-api/
 */

const BASE = '/yi-api';

const WUXING_MAP: Record<string, 'jin' | 'mu' | 'shui' | 'huo' | 'tu'> = {
  '0': 'jin',
  '1': 'mu',
  '2': 'shui',
  '3': 'huo',
  '4': 'tu',
};

export interface GuaDto {
  gua_num: number;
  gua_name: string;
  gua_pinyin: string;
  wuxing: number;
  binary: string;
  guaci: string;
  yaoci: string[];
}

export interface ThemeDto {
  id: number;
  name: string;
  prompt: string;
  enabled: number;
  created_at: string;
  updated_at: string;
}

// 转换为前端 GuaBase 类型（字段名映射）
export function toGuaBase(dto: GuaDto) {
  return {
    num: dto.gua_num,
    name: dto.gua_name,
    pinyin: dto.gua_pinyin,
    wuxing: WUXING_MAP[String(dto.wuxing)] ?? 'jin',
    binary: dto.binary,
    guaci: dto.guaci,
    yaoci: dto.yaoci ?? [],
  };
}

export async function fetchGuaList(): Promise<GuaDto[]> {
  const res = await fetch(`${BASE}/gua`);
  if (!res.ok) throw new Error(`fetchGuaList failed: ${res.status}`);
  return res.json();
}

export async function fetchThemeList(enabled?: boolean): Promise<ThemeDto[]> {
  const url = enabled !== undefined ? `${BASE}/themes?enabled=${enabled}` : `${BASE}/themes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetchThemeList failed: ${res.status}`);
  return res.json();
}

export async function fetchImageList(params: {
  gua_num?: number;
  theme_name?: string;
  status?: number;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params.gua_num !== undefined) sp.set('gua_num', String(params.gua_num));
  if (params.theme_name) sp.set('theme_name', params.theme_name);
  sp.set('status', String(params.status ?? 0));
  sp.set('limit', String(params.limit ?? 50));
  const res = await fetch(`${BASE}/images?${sp}`);
  if (!res.ok) throw new Error(`fetchImageList failed: ${res.status}`);
  return res.json();
}
