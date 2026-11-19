import type { ApiErrorBody, ApiErrorCode } from '../../src/types/api.js';

/** JSON 응답 (위치 기반 결과라 캐시하지 않음) */
export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export function errorResponse(code: ApiErrorCode, message: string, status: number): Response {
  const body: ApiErrorBody = { error: code, message };
  return json(body, status);
}

/** 정수 쿼리 파라미터 읽기 (없거나 잘못되면 기본값, 범위 밖이면 잘라냄) */
export function readInt(value: string | null, fallback: number, min: number, max: number): number {
  const n = value === null || value === '' ? NaN : Number(value);
  if (!Number.isInteger(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

/** 좌표 쿼리 파라미터 읽기 (없거나 잘못되면 undefined) */
export function readCoord(value: string | null, limit: number): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : undefined;
}

/** 검색어 읽기 (앞뒤 공백 제거, 1~50자) */
export function readQuery(value: string | null): string | undefined {
  const query = value?.trim() ?? '';
  return query.length > 0 && query.length <= 50 ? query : undefined;
}
