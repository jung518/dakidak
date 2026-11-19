import { COOKING_LABEL, CUISINE_LABEL, TASTE_LABEL } from '../data/labels';
import type { ChickenMenu } from '../types';

/**
 * 거리(m)를 보기 좋은 문자열로 변환
 * - 1000m 미만: "350m"
 * - 1000m 이상: "1.2km", "3km"
 */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return '';
  if (meters < 1000) return `${Math.round(meters)}m`;
  const km = meters / 1000;
  return `${km < 10 ? Number(km.toFixed(1)) : Math.round(km)}km`;
}

/** 메뉴의 태그 목록을 한글 라벨 배열로 변환 (예: ['한식', '볶음', '매콤']) */
export function getMenuTags(menu: ChickenMenu): string[] {
  const tags = [
    CUISINE_LABEL[menu.cuisine],
    ...menu.cooking.map((c) => COOKING_LABEL[c]),
    ...menu.taste.map((t) => TASTE_LABEL[t]),
  ];
  return Array.from(new Set(tags));
}

/** 태그 배열을 "#한식 #볶음 #매콤" 형식 문자열로 변환 */
export function formatTags(tags: string[]): string {
  return tags.map((t) => `#${t}`).join(' ');
}

/** 카카오맵 길찾기 링크 생성 */
export function buildDirectionsUrl(name: string, y: number, x: number): string {
  return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${y},${x}`;
}
