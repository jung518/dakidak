/**
 * GET /api/geocode?query=강남역
 * 동네/역 이름을 카카오 키워드 검색으로 좌표로 변환 (위치 권한 거부 시 사용)
 * - KAKAO_REST_API_KEY 가 없으면 목업 좌표를 반환
 */
import type { GeocodeResponse } from '../src/types/api.js';
import { errorResponse, json, readQuery } from './_lib/http.js';
import { getKakaoKey, kakaoErrorResponse, searchKeyword } from './_lib/kakao.js';
import { mockGeocode } from './_lib/mock.js';

export async function GET(request: Request): Promise<Response> {
  const query = readQuery(new URL(request.url).searchParams.get('query'));
  if (!query) return errorResponse('bad_request', '지역 이름(query)이 필요해요.', 400);

  const apiKey = getKakaoKey();
  if (!apiKey) return json(mockGeocode(query));

  try {
    const data = await searchKeyword(apiKey, { query, size: 1 });
    const place = data.documents[0];
    if (!place) return errorResponse('not_found', `'${query}'을(를) 찾지 못했어요.`, 404);

    const body: GeocodeResponse = {
      x: Number(place.x),
      y: Number(place.y),
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      mock: false,
    };
    return json(body);
  } catch (error) {
    return kakaoErrorResponse(error);
  }
}
