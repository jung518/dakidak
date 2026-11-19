/**
 * GET /api/restaurants?query=닭갈비&x=127.02&y=37.49&radius=1000&page=1
 * 메뉴 키워드와 좌표로 주변 음식점(FD6)을 거리순으로 검색
 * - KAKAO_REST_API_KEY 가 없으면 목업 데이터를 반환
 */
import type { RestaurantsResponse } from '../src/types/api.js';
import { errorResponse, json, readCoord, readInt, readQuery } from './_lib/http.js';
import { getKakaoKey, kakaoErrorResponse, searchKeyword, toRestaurant } from './_lib/kakao.js';
import { mockRestaurants } from './_lib/mock.js';

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const query = readQuery(params.get('query'));
  const x = readCoord(params.get('x'), 180);
  const y = readCoord(params.get('y'), 90);
  const radius = readInt(params.get('radius'), 1000, 1, 20000);
  const page = readInt(params.get('page'), 1, 1, 45);

  if (!query) return errorResponse('bad_request', '검색어(query)가 필요해요.', 400);
  if (x === undefined || y === undefined) return errorResponse('bad_request', '좌표(x, y)가 올바르지 않아요.', 400);

  const apiKey = getKakaoKey();
  if (!apiKey) return json(mockRestaurants({ query, x, y, radius, page }));

  try {
    const data = await searchKeyword(apiKey, {
      query,
      x,
      y,
      radius,
      page,
      size: 15,
      sort: 'distance',
      category_group_code: 'FD6',
    });
    const body: RestaurantsResponse = {
      restaurants: data.documents.map(toRestaurant),
      isEnd: data.meta.is_end,
      mock: false,
    };
    return json(body);
  } catch (error) {
    return kakaoErrorResponse(error);
  }
}
