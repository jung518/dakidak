import type { ApiErrorCode } from '../../src/types/api.js';
import type { Restaurant } from '../../src/types/restaurant.js';
import { errorResponse } from './http.js';

const KEYWORD_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';
const TIMEOUT_MS = 5000;

/** 카카오 키워드 검색 장소 (필요한 필드만) */
export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  /** x, y 를 넘겼을 때만 값이 있음 (m) */
  distance: string;
}

export interface KakaoKeywordResponse {
  meta: { is_end: boolean; pageable_count: number; total_count: number };
  documents: KakaoPlace[];
}

export class KakaoError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.name = 'KakaoError';
    this.code = code;
    this.status = status;
  }
}

/** REST API 키 (없으면 undefined → 목업 데이터 사용) */
export function getKakaoKey(): string | undefined {
  const key = process.env.KAKAO_REST_API_KEY?.trim();
  return key ? key : undefined;
}

/** 카카오 로컬 키워드 검색 호출 */
export async function searchKeyword(
  apiKey: string,
  params: Record<string, string | number>,
): Promise<KakaoKeywordResponse> {
  const url = new URL(KEYWORD_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error('[kakao] request failed', error);
    throw new KakaoError('upstream', 502, '카카오 서버에 연결하지 못했어요.');
  }

  if (res.status === 429) {
    throw new KakaoError('rate_limited', 429, '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.');
  }
  if (!res.ok) {
    // 401/403 은 대부분 키 문제. 상세 내용은 서버 로그에만 남김
    console.error('[kakao] error response', res.status, await res.text().catch(() => ''));
    throw new KakaoError('upstream', 502, '카카오 검색에 실패했어요.');
  }
  return (await res.json()) as KakaoKeywordResponse;
}

/** 카카오 장소를 앱에서 쓰는 Restaurant 형태로 변환 */
export function toRestaurant(place: KakaoPlace): Restaurant {
  const restaurant: Restaurant = {
    id: place.id,
    name: place.place_name,
    category: place.category_name,
    address: place.road_address_name || place.address_name,
    distance: Number(place.distance) || 0,
    placeUrl: place.place_url,
    x: Number(place.x),
    y: Number(place.y),
  };
  if (place.phone) restaurant.phone = place.phone;
  return restaurant;
}

/** KakaoError 등 예외를 오류 응답으로 변환 */
export function kakaoErrorResponse(error: unknown): Response {
  if (error instanceof KakaoError) return errorResponse(error.code, error.message, error.status);
  console.error('[api] unexpected error', error);
  return errorResponse('upstream', '알 수 없는 오류가 발생했어요.', 500);
}
