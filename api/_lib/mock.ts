/**
 * 카카오 키가 없을 때 쓰는 목업 데이터
 * - 같은 검색어/좌표면 항상 같은 결과 (id 가 바뀌지 않아 "다시 추천" 제외 로직을 테스트할 수 있음)
 * - 반경별 개수: 1km 5~6곳 / 3km 16곳(2페이지) / 5km 26곳(2페이지)
 *   → 다시 추천 시 페이지 추가 요청, 반경 확장, "다 보여드렸어요" 흐름을 모두 확인 가능
 */
import type { GeocodeResponse, RestaurantsResponse } from '../../src/types/api.js';
import type { Restaurant } from '../../src/types/restaurant.js';

const PAGE_SIZE = 15;
const MOCK_COUNT = 26;
const BRANDS = ['꼬끼오', '황금닭', '닭이닭', '병아리네', '토종닭집', '바삭공방', '달구지', '닭장군', '홰치는집', '볏'];
const BRANCHES = ['본점', '역앞점', '시장점'];
const GOLDEN_ANGLE = 2.399963;
const METERS_PER_DEGREE = 111_320;

/** 문자열을 0 이상의 정수로 (결과를 고정하기 위한 간단한 해시) */
function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function buildPool(query: string, x: number, y: number): Restaurant[] {
  const seed = hash(query);
  return Array.from({ length: MOCK_COUNT }, (_, i) => {
    const distance = 60 + i * 185 + (seed % 40);
    const angle = i * GOLDEN_ANGLE + (seed % 7);
    const dy = (distance * Math.sin(angle)) / METERS_PER_DEGREE;
    const dx = (distance * Math.cos(angle)) / (METERS_PER_DEGREE * Math.cos((y * Math.PI) / 180));
    const name = `${BRANDS[i % BRANDS.length]} ${query} ${BRANCHES[Math.floor(i / BRANDS.length)]}`;

    const restaurant: Restaurant = {
      id: `mock-${seed}-${i}`,
      name,
      category: '음식점 > 닭요리',
      address: `예시시 닭이닭구 꼬끼오로 ${i + 1}`,
      distance,
      placeUrl: `https://map.kakao.com/?q=${encodeURIComponent(query)}`,
      x: Number((x + dx).toFixed(6)),
      y: Number((y + dy).toFixed(6)),
    };
    if (i % 3 !== 2) restaurant.phone = `02-000-${String(1000 + i)}`;
    return restaurant;
  });
}

export function mockRestaurants(params: {
  query: string;
  x: number;
  y: number;
  radius: number;
  page: number;
}): RestaurantsResponse {
  const inRadius = buildPool(params.query, params.x, params.y).filter((r) => r.distance <= params.radius);
  const start = (params.page - 1) * PAGE_SIZE;
  return {
    restaurants: inRadius.slice(start, start + PAGE_SIZE),
    isEnd: start + PAGE_SIZE >= inRadius.length,
    mock: true,
  };
}

/** 목업 좌표: 어떤 지역을 입력해도 서울시청 근처로 */
export function mockGeocode(query: string): GeocodeResponse {
  return { x: 126.978388, y: 37.566610, name: query, address: '예시 좌표 (서울시청)', mock: true };
}
