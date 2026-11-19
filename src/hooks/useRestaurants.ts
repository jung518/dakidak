import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, fetchRestaurants, isAbortError } from '../api/client';
import type { ApiErrorCode, Coordinates, Restaurant } from '../types';
import { shuffle } from '../utils/recommend';

/** 검색 반경(m): 부족하면 순서대로 넓힘 */
export const SEARCH_RADII = [1000, 3000, 5000] as const;
/** 한 번에 보여줄 식당 수 */
export const SHOW_COUNT = 3;
/** 카카오 키워드 검색 최대 페이지 */
const MAX_PAGE = 45;
const LAST_RADIUS_INDEX = SEARCH_RADII.length - 1;

/** 반경 단계(index)를 m 단위 반경으로 (범위를 벗어나면 가장 넓은 반경) */
function radiusAt(index: number): number {
  return SEARCH_RADII[Math.min(Math.max(index, 0), LAST_RADIUS_INDEX)] ?? SEARCH_RADII[0];
}

export type RestaurantsStatus =
  | 'idle'
  | 'loading'
  | 'success'
  /** 가장 처음 검색 결과가 0건 */
  | 'empty'
  | 'error';

/** 검색 진행 상황 (렌더링과 무관하게 계속 바뀌므로 ref 로 관리) */
export interface SearchCursor {
  /** 지금까지 받은 식당 (받을 때마다 섞어서 뒤에 붙임) */
  pool: Restaurant[];
  /** 이미 보여준 식당 id */
  shown: Set<string>;
  radiusIndex: number;
  /** 현재 반경에서 마지막으로 받은 페이지 (0 이면 아직 안 받음) */
  page: number;
  /** 현재 반경의 마지막 페이지까지 받았는지 */
  isEnd: boolean;
}

export const createCursor = (): SearchCursor => ({
  pool: [],
  shown: new Set(),
  radiusIndex: 0,
  page: 0,
  isEnd: false,
});

/** load: 현재 반경 안에서만 / reroll: 부족하면 반경을 자동으로 넓힘 */
export type Mode = 'load' | 'reroll';

/** 반경과 페이지로 식당 한 페이지를 받아오는 함수 */
export type PageFetcher = (radius: number, page: number) => Promise<{ restaurants: Restaurant[]; isEnd: boolean }>;

export interface BatchResult {
  /** 새로 보여줄 식당 (최대 3곳, 이미 보여준 식당 제외) */
  next: Restaurant[];
  /** 아직 안 보여준 식당이 더 있을 수 있는지 */
  hasMore: boolean;
  /** 처음 검색부터 결과가 0건인지 */
  firstEmpty: boolean;
}

/**
 * 다음에 보여줄 식당 3곳 고르기 (React 와 무관한 핵심 로직)
 * - cursor 를 직접 갱신함 (받은 식당, 보여준 id, 반경, 페이지)
 */
export async function takeNextBatch(cursor: SearchCursor, mode: Mode, fetchPage: PageFetcher): Promise<BatchResult> {
  const unseen = () => cursor.pool.filter((r) => !cursor.shown.has(r.id));

  const fetchNextPage = async () => {
    const page = cursor.page + 1;
    const res = await fetchPage(radiusAt(cursor.radiusIndex), page);
    const known = new Set(cursor.pool.map((r) => r.id));
    cursor.pool.push(...shuffle(res.restaurants.filter((r) => !known.has(r.id))));
    cursor.page = page;
    cursor.isEnd = res.isEnd || res.restaurants.length === 0 || page >= MAX_PAGE;
  };

  if (cursor.page === 0) await fetchNextPage();

  while (unseen().length < SHOW_COUNT) {
    if (!cursor.isEnd) {
      await fetchNextPage();
      continue;
    }
    if (mode === 'reroll' && cursor.radiusIndex < LAST_RADIUS_INDEX) {
      cursor.radiusIndex += 1;
      cursor.page = 0;
      cursor.isEnd = false;
      await fetchNextPage();
      continue;
    }
    break;
  }

  // 고르는 건 섞어서, 보여줄 때는 가까운 순으로
  const next = unseen()
    .slice(0, SHOW_COUNT)
    .sort((a, b) => a.distance - b.distance);
  next.forEach((r) => cursor.shown.add(r.id));
  return {
    next,
    hasMore:
      next.length > 0 && (unseen().length > 0 || !cursor.isEnd || cursor.radiusIndex < LAST_RADIUS_INDEX),
    firstEmpty: next.length === 0 && cursor.shown.size === 0,
  };
}

export interface UseRestaurantsResult {
  status: RestaurantsStatus;
  /** 지금 보여줄 식당 (최대 3곳) */
  restaurants: Restaurant[];
  /** 현재 검색 반경(m) */
  radius: number;
  /** 더 넓은 반경이 남아 있는지 */
  canExpandRadius: boolean;
  /** 아직 안 보여준 식당이 더 있을 수 있는지 (false 면 "다 보여드렸어요") */
  hasMore: boolean;
  errorCode: ApiErrorCode | undefined;
  /** 목업 데이터인지 (카카오 키 없음) */
  isMock: boolean;
  /** 이미 보여준 식당을 빼고 새로 3곳 */
  reroll: () => void;
  /** 반경을 한 단계 넓혀서 다시 검색 (결과 0건일 때) */
  expandRadius: () => void;
  /** 오류 후 마지막 동작 다시 시도 */
  retry: () => void;
}

/**
 * 식당 조회, 셔플, 다시 추천, 반경 확장
 * 1. 처음에는 1km 반경에서 최대 15곳을 받아 섞은 뒤 3곳 표시
 * 2. 다시 추천: 이미 보여준 식당 제외 → 부족하면 다음 페이지 → 그래도 부족하면 3km, 5km
 * 3. 끝까지 없으면 hasMore = false
 */
export function useRestaurants(keyword: string, coords: Coordinates | undefined): UseRestaurantsResult {
  const [status, setStatus] = useState<RestaurantsStatus>('idle');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [radiusIndex, setRadiusIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [errorCode, setErrorCode] = useState<ApiErrorCode>();
  const [isMock, setIsMock] = useState(false);

  const cursorRef = useRef<SearchCursor>(createCursor());
  const abortRef = useRef<AbortController | undefined>(undefined);
  const lastModeRef = useRef<Mode>('load');

  const x = coords?.x;
  const y = coords?.y;

  const run = useCallback(
    async (mode: Mode) => {
      if (!keyword || x === undefined || y === undefined) return;
      const origin = { x, y };
      lastModeRef.current = mode;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;
      const cursor = cursorRef.current;

      setStatus('loading');
      setErrorCode(undefined);

      const fetchPage: PageFetcher = async (radius, page) => {
        const res = await fetchRestaurants({ query: keyword, ...origin, radius, page }, signal);
        // 응답 직후 취소됐다면 진행 상황을 바꾸지 않음
        if (signal.aborted) throw new DOMException('aborted', 'AbortError');
        setIsMock(res.mock);
        return res;
      };

      try {
        const { next, hasMore: more, firstEmpty } = await takeNextBatch(cursor, mode, fetchPage);
        if (firstEmpty) {
          setRestaurants([]);
          setStatus('empty');
        } else {
          // 다시 추천했는데 새 식당이 없으면 기존 카드를 유지하고 "다 보여드렸어요"
          if (next.length > 0) setRestaurants(next);
          setStatus('success');
        }
        setHasMore(more);
        setRadiusIndex(cursor.radiusIndex);
      } catch (error) {
        if (isAbortError(error)) return;
        setErrorCode(error instanceof ApiError ? error.code : 'upstream');
        setRadiusIndex(cursor.radiusIndex);
        setStatus('error');
      }
    },
    [keyword, x, y],
  );

  // 메뉴나 위치가 바뀌면 처음부터 다시 검색
  useEffect(() => {
    cursorRef.current = createCursor();
    setRestaurants([]);
    setRadiusIndex(0);
    setHasMore(true);
    setErrorCode(undefined);
    if (!keyword || x === undefined || y === undefined) {
      setStatus('idle');
      return;
    }
    void run('load');
    return () => abortRef.current?.abort();
  }, [keyword, x, y, run]);

  const reroll = useCallback(() => void run('reroll'), [run]);

  const expandRadius = useCallback(() => {
    const cursor = cursorRef.current;
    if (cursor.radiusIndex >= LAST_RADIUS_INDEX) return;
    cursor.radiusIndex += 1;
    cursor.page = 0;
    cursor.isEnd = false;
    void run('load');
  }, [run]);

  const retry = useCallback(() => void run(lastModeRef.current), [run]);

  return {
    status,
    restaurants,
    radius: radiusAt(radiusIndex),
    canExpandRadius: radiusIndex < LAST_RADIUS_INDEX,
    hasMore,
    errorCode,
    isMock,
    reroll,
    expandRadius,
    retry,
  };
}
