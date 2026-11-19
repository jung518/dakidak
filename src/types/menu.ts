export type Cuisine = 'korean' | 'western' | 'japanese' | 'chinese';
export type Cooking = 'soup' | 'stirfry' | 'fried' | 'grilled' | 'braised';
export type Taste = 'spicy' | 'mild' | 'sweet' | 'savory';
export type Portion = 'light' | 'hearty';

export interface ChickenMenu {
  /** URL 등에 쓰이는 고유 id (예: 'dakgalbi') */
  id: string;
  /** 표시 이름 (예: '닭갈비') */
  name: string;
  /** 한 줄 설명 */
  description: string;
  /** 실제 이미지 경로 (없으면 카드에 메뉴 이름 첫 글자를 표시) */
  image?: string;
  cuisine: Cuisine;
  cooking: Cooking[];
  taste: Taste[];
  portion: Portion;
  /** 카카오 키워드 검색용 키워드 */
  searchKeyword: string;
}
