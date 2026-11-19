import { useCallback, useEffect, useRef, useState } from 'react';
import { MENUS } from '../data/menus';
import type { ChickenMenu } from '../types';
import { pickRandomMenu } from '../utils/recommend';

export interface UseRandomRecommendOptions {
  /** 추천 후보 (기본: 전체 메뉴) */
  pool?: readonly ChickenMenu[];
  /** 셔플 애니메이션 시간(ms) */
  shuffleMs?: number;
}

export interface UseRandomRecommendResult {
  /** 현재 추천된 메뉴 (첫 셔플이 끝나기 전에는 undefined) */
  menu: ChickenMenu | undefined;
  /** 셔플 애니메이션 중인지 */
  isShuffling: boolean;
  /** 직전 메뉴와 다른 메뉴로 다시 추천 */
  reroll: () => void;
}

/** 랜덤 추천: 마운트 시 자동으로 셔플 후 1개 추천, reroll 로 다시 추천 */
export function useRandomRecommend({
  pool = MENUS,
  shuffleMs = 1000,
}: UseRandomRecommendOptions = {}): UseRandomRecommendResult {
  const [menu, setMenu] = useState<ChickenMenu>();
  const [isShuffling, setIsShuffling] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);
  const lastIdRef = useRef<string | undefined>(undefined);

  const reroll = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setIsShuffling(true);

    const next = pickRandomMenu(pool, lastIdRef.current);
    timerRef.current = window.setTimeout(() => {
      lastIdRef.current = next?.id;
      setMenu(next);
      setIsShuffling(false);
    }, shuffleMs);
  }, [pool, shuffleMs]);

  useEffect(() => {
    reroll();
    return () => window.clearTimeout(timerRef.current);
  }, [reroll]);

  return { menu, isShuffling, reroll };
}
