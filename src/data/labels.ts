import type { Cooking, Cuisine, Portion, Taste } from '../types';

/** 태그 표시용 한글 라벨 (예: #한식 #볶음 #매콤) */
export const CUISINE_LABEL: Record<Cuisine, string> = {
  korean: '한식',
  western: '양식',
  japanese: '일식',
  chinese: '중식',
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

export const PORTION_LABEL: Record<Portion, string> = {
  light: '가벼운',
  hearty: '든든한',
};
