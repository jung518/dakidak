import type { Restaurant } from './restaurant';

/** 경도(x), 위도(y) 좌표 */
export interface Coordinates {
  x: number;
  y: number;
}

/** GET /api/restaurants 응답 */
export interface RestaurantsResponse {
  restaurants: Restaurant[];
  /** 마지막 페이지인지 */
  isEnd: boolean;
  /** 카카오 키가 없어 목업 데이터를 돌려줬는지 */
  mock: boolean;
}

/** GET /api/geocode 응답 */
export interface GeocodeResponse extends Coordinates {
  /** 찾은 장소 이름 (예: '강남역 2호선') */
  name: string;
  address?: string;
  mock: boolean;
}

export type ApiErrorCode = 'bad_request' | 'not_found' | 'rate_limited' | 'upstream' | 'network';

/** /api/* 오류 응답 */
export interface ApiErrorBody {
  error: ApiErrorCode;
  message: string;
}
