import type { AnyQuizStep } from '../types';

/** "상관없음" 선택지 (모든 단계 공통) */
export const ANY_OPTION = {
  value: 'any',
  label: '상관없음',
  description: '아무거나 좋아요',
} as const;

/**
 * 단계별 선택 질문 (순서대로 1~4단계)
 * - "상관없음" 은 화면에서 자동으로 마지막에 붙임
 */
export const QUIZ_STEPS: AnyQuizStep[] = [
  {
    key: 'mealType',
    question: '어떻게 먹고 싶어?',
    options: [
      { value: 'rice', label: '밥이랑', description: '덮밥, 국밥처럼 밥과 함께' },
      { value: 'noodle', label: '면이랑', description: '칼국수, 라멘처럼 면과 함께' },
      { value: 'dish', label: '요리로 푸짐하게', description: '가운데 놓고 나눠 먹는 메인 요리' },
      { value: 'snack', label: '안주·간식으로', description: '가볍게 집어 먹는 안주나 간식' },
    ],
  },
  {
    key: 'cooking',
    question: '어떻게 조리된 게 좋아?',
    options: [
      { value: 'soup', label: '국물', description: '탕, 국밥, 국수처럼 뜨끈하게' },
      { value: 'stirfry', label: '볶음', description: '철판이나 웍에 볶아서' },
      { value: 'fried', label: '튀김', description: '겉은 바삭하게 튀겨서' },
      { value: 'grilled', label: '구이', description: '불에 노릇하게 구워서' },
      { value: 'braised', label: '찜·조림', description: '양념에 푹 졸이거나 쪄서' },
    ],
  },
  {
    key: 'taste',
    question: '오늘의 입맛은?',
    options: [
      { value: 'spicy', label: '매콤한 맛', description: '칼칼하고 화끈하게' },
      { value: 'mild', label: '담백한 맛', description: '맵지 않고 순하게' },
      { value: 'sweet', label: '달콤한 맛', description: '달달하거나 단짠으로' },
      { value: 'savory', label: '짭짤·고소한 맛', description: '감칠맛 나고 고소하게' },
    ],
  },
  {
    key: 'servings',
    question: '누구랑 먹어?',
    options: [
      { value: 'solo', label: '혼자', description: '혼밥하기 좋은 1인 메뉴' },
      { value: 'group', label: '여럿이', description: '나눠 먹기 좋은 메뉴' },
    ],
  },
];
