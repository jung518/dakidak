/** 요리 분류 (단계별 선택에는 쓰지 않고 태그 표시용) */
export type Cuisine = 'korean' | 'western' | 'japanese' | 'chinese';
/** 1단계: 어떻게 먹고 싶어? */
export type MealType = 'rice' | 'noodle' | 'dish' | 'snack';
/** 2단계: 어떻게 조리된 게 좋아? */
export type Cooking = 'soup' | 'stirfry' | 'fried' | 'grilled' | 'braised';
/** 3단계: 오늘의 입맛은? */
export type Taste = 'spicy' | 'mild' | 'sweet' | 'savory';
/** 4단계: 누구랑 먹어? */
export type Servings = 'solo' | 'group';

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
  mealType: MealType[];
  cooking: Cooking[];
  taste: Taste[];
  servings: Servings[];
  /** 카카오 키워드 검색용 키워드 */
  searchKeyword: string;
}
