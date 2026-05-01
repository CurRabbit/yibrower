'use client';

import { useEffect, useState } from 'react';
import type { GuaBase } from '@/lib/types';
import { getGuaKey } from '@/components/HexGrid';

interface AudioPlayerProps {
  gua: GuaBase;
  className?: string;
}

export default function AudioPlayer({ gua, className = '' }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const key = getGuaKey(gua);
  // getGuaKey 返回完整 key 如 "gua_01_qian"，无需再加前缀
  const guaKey = key;
  const audioSrc = `/yi/assets/${guaKey}/music/${guaKey}.mp3`;

  useEffect(() => {
    const audio = new Audio(audioSrc);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = new Audio(audioSrc);
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 p-3 bg-surface-2 rounded-xl ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-vermilion flex items-center justify-center transition-transform active:scale-95"
        aria-label={playing ? '暂停' : '播放'}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <rect x="3" y="2" width="4" height="12" />
            <rect x="9" y="2" width="4" height="12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
        )}
      </button>

      {/* Progress Bar */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-1 rounded-full bg-[#333] overflow-hidden">
          <div
            className="h-full rounded-full bg-gold transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-ink-faint">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
