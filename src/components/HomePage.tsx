"use client";

import { useState, useMemo, useEffect } from "react";
import type { Wuxing, Position } from "@/lib/types";
import type { GuaBase } from "@/lib/types";
import { GUA_DATA } from "@/data/gua-data";
import { fetchGuaList, toGuaBase } from "@/lib/api";
import ParticleCanvas from "@/components/ParticleCanvas";
import Header from "@/components/Header";
import HexGrid, { getGuaKey } from "@/components/HexGrid";
import GuaDetail from "@/components/GuaDetail";
import ImmersionView from "@/components/ImmersionView";

export default function HomePage() {
  const [guaData, setGuaData] = useState<GuaBase[] | null>(null);
  const [apiError, setApiError] = useState(false);

  const [search, setSearch] = useState("");
  const [wuxing, setWuxing] = useState<Wuxing | "all">("all");
  const [position, setPosition] = useState<Position | "all">("all");
  const [trigram, setTrigram] = useState<string>(""); // 三爻卦binary，如'111'
  const [selectedGua, setSelectedGua] = useState<GuaBase | null>(null);
  const [immersedGua, setImmersedGua] = useState<GuaBase | null>(null);
  const [theme, setTheme] = useState<string>("default"); // 'default' | 'ink' | 'celadon' | 'vermilion'

  // 从 API 加载卦数据，失败时 fallback 到静态数据
  useEffect(() => {
    fetchGuaList()
      .then((dtos) => {
        const mapped = dtos.map(toGuaBase);
        // 按卦序排序
        mapped.sort((a, b) => a.num - b.num);
        setGuaData(mapped);
      })
      .catch((err) => {
        console.error("[HomePage] API fetch failed, using static data:", err);
        setApiError(true);
        setGuaData(null);
      });
  }, []);

  // 优先用 API 数据，失败时用静态数据
  const sourceData = guaData ?? GUA_DATA;

  const filtered = useMemo(() => {
    return sourceData.filter((g) => {
      const matchWx = wuxing === "all" || g.wuxing === wuxing;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        g.name.includes(q) ||
        g.pinyin.toLowerCase().includes(q) ||
        String(g.num).padStart(2, '0').includes(q) ||
        g.num === parseInt(q);
      // 外卦=前3位(爻1-3)，内卦=后3位(爻4-6)
      const innerTri = g.binary.slice(3);
      const outerTri = g.binary.slice(0, 3);

      let matchPos = true;
      if (position !== 'all' && trigram) {
        // 同时指定了位置和三爻卦
        matchPos = position === 'inner'
          ? innerTri === trigram
          : outerTri === trigram;
      }
      return matchWx && matchSearch && matchPos;
    });
  }, [sourceData, search, wuxing, position, trigram]);

  function handleSelect(key: string) {
    const gua = sourceData.find((g) => getGuaKey(g) === key);
    if (gua) setSelectedGua(gua);
  }

  function handleWuxingChange(v: string) {
    const next = v as Wuxing | 'all';
    setWuxing(next);
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-wx', next === 'all' ? '' : next);
      (window as unknown as Record<string, string>).__atm_color =
        next === 'all' ? '#c8961e' :
        next === 'jin' ? '#c8961e' :
        next === 'mu'  ? '#5a8c5a' :
        next === 'shui'? '#4a7c9b' :
        next === 'huo'? '#b84a2d' : '#7a6c3a';
    }
  }

  function handlePositionChange(v: string) {
    setPosition(v as Position | 'all');
    // 切换到 all 时清空三爻卦；切换位置时也重置，保持 UX 一致
    if (v === 'all') setTrigram('');
  }

  function handleTrigramChange(b: string) {
    setTrigram(b);
  }

  function handleThemeChange(v: string) {
    setTheme(v);
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', v === 'default' ? '' : v);
    }
  }

  function handleClose() {
    setSelectedGua(null);
  }

  function handleImmersion() {
    if (selectedGua) {
      setImmersedGua(selectedGua);
      setSelectedGua(null);
    }
  }

  function handleExitImmersion() {
    setImmersedGua(null);
  }

  function handlePrev() {
    if (!immersedGua) return;
    const idx = sourceData.findIndex((g) => g.num === immersedGua.num);
    if (idx > 0) setImmersedGua(sourceData[idx - 1]);
  }

  function handleNext() {
    if (!immersedGua) return;
    const idx = sourceData.findIndex((g) => g.num === immersedGua.num);
    if (idx < sourceData.length - 1) setImmersedGua(sourceData[idx + 1]);
  }

  const isLoading = guaData === null && !apiError;

  return (
    <>
      <ParticleCanvas />
      <Header
        searchValue={search}
        onSearchChange={setSearch}
        wuxingActive={wuxing}
        onWuxingChange={handleWuxingChange}
        positionActive={position}
        onPositionChange={handlePositionChange}
        trigramActive={trigram}
        onTrigramChange={handleTrigramChange}
        totalGuas={filtered.length}
        themeActive={theme}
        onThemeChange={handleThemeChange}
      />
      <main
        style={{
          position: "relative",
          zIndex: 1,
          padding: "32px max(24px, calc((100% - 1200px) / 2)) 64px",
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="text-4xl opacity-30 animate-pulse">☷</div>
            <p className="text-ink-faint text-sm">加载中…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4 opacity-20">☷</div>
            <p className="text-ink-faint text-lg">未找到匹配结果</p>
            <p className="text-ink-faint text-sm mt-1">试试其他搜索词或筛选条件</p>
          </div>
        ) : (
          <HexGrid guas={filtered} onSelect={handleSelect} />
        )}
      </main>

      {selectedGua && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(13,10,7,0.88)",
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={handleClose}
        >
          <GuaDetail
            gua={selectedGua}
            guaData={sourceData}
            onClose={handleClose}
            onImmersion={handleImmersion}
          />
        </div>
      )}

      {immersedGua && (
        <ImmersionView
          gua={immersedGua}
          onExit={handleExitImmersion}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
