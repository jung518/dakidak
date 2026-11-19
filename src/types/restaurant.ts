/** 프론트엔드에서 사용하는 식당 정보 (카카오 응답을 서버에서 가공한 형태) */
export interface Restaurant {
  /** 카카오 장소 id */
  id: string;
  /** 식당 이름 (place_name) */
  name: string;
  /** 카테고리 (예: '음식점 > 한식 > 닭요리') */
  category: string;
  /** 도로명 주소 (없으면 지번 주소) */
  address: string;
  /** 현재 위치로부터의 거리(m) */
  distance: number;
  /** 전화번호 (없을 수 있음) */
  phone?: string;
  /** 카카오맵 상세 페이지 URL */
  placeUrl: string;
  /** 경도(longitude) */
  x: number;
  /** 위도(latitude) */
  y: number;
}
