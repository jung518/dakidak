import type { Cooking, Cuisine, MealType, Servings, Taste } from '../types';

/** 태그 표시용 한글 라벨 (예: #한식 #볶음 #매콤) */
export const CUISINE_LABEL: Record<Cuisine, string> = {
  korean: '한식',
  western: '양식',
  japanese: '일식',
  chinese: '중식',
};

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  rice: '밥이랑',
  noodle: '면이랑',
  dish: '요리로 푸짐하게',
  snack: '안주·간식으로',
};

export const COOKING_LABEL: Record<Cooking, string> = {
  soup: '국물',
  stirfry: '볶음',
  fried: '튀김',
  grilled: '구이',
  braised: '찜·조림',
};

export const TASTE_LABEL: Record<Taste, string> = {
  spicy: '매콤',
  mild: '담백',
  sweet: '달콤',
  savory: '짭짤·고소',
};

export const SERVINGS_LABEL: Record<Servings, string> = {
  solo: '혼자',
  group: '여럿이',
};
