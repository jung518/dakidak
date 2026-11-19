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
  /** 임시 이미지 대용 이모지 */
  emoji: string;
  /** 추후 실제 이미지 경로 */
  image?: string;
  cuisine: Cuisine;
  cooking: Cooking[];
  taste: Taste[];
  portion: Portion;
  /** 카카오 키워드 검색용 키워드 */
  searchKeyword: string;
}
