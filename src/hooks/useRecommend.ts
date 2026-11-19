import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MENUS } from '../data/menus';
import type { ChickenMenu, QuizAnswers } from '../types';
import { getQuizCandidates, pickRandomMenu, recommendByAnswers } from '../utils/recommend';

/* =========================== 공통: 셔플 후 고르기 =========================== */

interface ShuffledPickOptions {
  /** 셔플 애니메이션 시간(ms) */
  shuffleMs: number;
  /** false 이면 추천하지 않고 대기 */
  enabled: boolean;
  /** 이 값이 바뀌면 새로 추천 (예: 답변이 바뀜) */
  resetKey: string;
}

/**
 * shuffleMs 동안 셔플 상태를 유지한 뒤 pick 결과를 확정
 * - reroll 시 직전 메뉴 id 를 pick 에 넘겨서 같은 메뉴 연속 추천을 막음
 */
function useShuffledPick<R extends { menu: ChickenMenu }>(
  pick: (excludeId?: string) => R | undefined,
  { shuffleMs, enabled, resetKey }: ShuffledPickOptions,
) {
  const [result, setResult] = useState<R>();
  const [isShuffling, setIsShuffling] = useState(enabled);
  const timerRef = useRef<number | undefined>(undefined);
  const lastIdRef = useRef<string | undefined>(undefined);
  const pickRef = useRef(pick);

  useEffect(() => {
    pickRef.current = pick;
  }, [pick]);

  const reroll = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setIsShuffling(true);

    const next = pickRef.current(lastIdRef.current);
    timerRef.current = window.setTimeout(() => {
      lastIdRef.current = next?.menu.id;
      setResult(next);
      setIsShuffling(false);
    }, shuffleMs);
  }, [shuffleMs]);

  useEffect(() => {
    if (!enabled) {
      window.clearTimeout(timerRef.current);
      setResult(undefined);
      setIsShuffling(false);
      return;
    }
    reroll();
    return () => window.clearTimeout(timerRef.current);
  }, [enabled, resetKey, reroll]);

  return { result, isShuffling, reroll };
}

/* =========================== 랜덤 추천 =========================== */

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
  const pick = useCallback(
    (excludeId?: string) => {
      const menu = pickRandomMenu(pool, excludeId);
      return menu ? { menu } : undefined;
    },
    [pool],
  );
  const { result, isShuffling, reroll } = useShuffledPick(pick, { shuffleMs, enabled: true, resetKey: '' });
  return { menu: result?.menu, isShuffling, reroll };
}

/* =========================== 조건 기반 추천 =========================== */

export interface UseQuizRecommendOptions {
  answers: QuizAnswers;
  /** 모든 단계에 답했을 때만 true 로 */
  enabled: boolean;
  pool?: readonly ChickenMenu[];
  shuffleMs?: number;
}

export interface UseQuizRecommendResult extends UseRandomRecommendResult {
  /** true: 모든 조건에 딱 맞음 / false: 점수제로 가장 비슷한 메뉴 */
  exact: boolean;
  /** 같은 조건으로 고를 수 있는 후보 */
  candidates: ChickenMenu[];
}

/** 조건 기반 추천: enabled 가 되면 셔플 후 1개 추천, reroll 은 직전 메뉴 제외 */
export function useQuizRecommend({
  answers,
  enabled,
  pool = MENUS,
  shuffleMs = 800,
}: UseQuizRecommendOptions): UseQuizRecommendResult {
  const resetKey = JSON.stringify(answers);
  const { candidates, exact } = useMemo(() => getQuizCandidates(pool, answers), [pool, answers]);

  const pick = useCallback(
    (excludeId?: string) => recommendByAnswers(pool, answers, excludeId),
    [pool, answers],
  );
  const { result, isShuffling, reroll } = useShuffledPick(pick, { shuffleMs, enabled, resetKey });

  return {
    menu: result?.menu,
    exact: result?.exact ?? exact,
    candidates,
    isShuffling,
    reroll,
  };
}
