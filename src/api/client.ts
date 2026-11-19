/**
 * /api/* 호출 함수 모음
 * - 카카오 REST API 키는 서버리스 함수에만 있고, 프론트엔드는 /api 만 호출
 */
import type { ApiErrorBody, ApiErrorCode, GeocodeResponse, RestaurantsResponse } from '../types';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function isErrorBody(body: unknown): body is ApiErrorBody {
  return typeof body === 'object' && body !== null && 'error' in body && 'message' in body;
}

function codeFromStatus(status: number): ApiErrorCode {
  if (status === 429) return 'rate_limited';
  if (status === 404) return 'not_found';
  if (status === 400) return 'bad_request';
  return 'upstream';
}

async function request<T>(path: string, params: Record<string, string | number>, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));

  let res: Response;
  try {
    res = await fetch(`${path}?${query}`, { signal, headers: { accept: 'application/json' } });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError('network', 0, '네트워크 연결을 확인해 주세요.');
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  if (!res.ok) {
    if (isErrorBody(body)) throw new ApiError(body.error, res.status, body.message);
    throw new ApiError(codeFromStatus(res.status), res.status, '요청을 처리하지 못했어요.');
  }
  if (body === undefined) throw new ApiError('upstream', res.status, '응답을 읽지 못했어요.');
  return body as T;
}

export interface FetchRestaurantsParams {
  query: string;
  x: number;
  y: number;
  /** 검색 반경(m) */
  radius: number;
  page: number;
}

/** 메뉴 키워드 + 좌표로 주변 식당 검색 */
export function fetchRestaurants(params: FetchRestaurantsParams, signal?: AbortSignal): Promise<RestaurantsResponse> {
  return request<RestaurantsResponse>('/api/restaurants', { ...params }, signal);
}

/** 지역명을 좌표로 변환 */
export function geocode(query: string, signal?: AbortSignal): Promise<GeocodeResponse> {
  return request<GeocodeResponse>('/api/geocode', { query }, signal);
}
