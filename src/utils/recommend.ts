import type { ChickenMenu, QuizAnswers, QuizKey } from '../types';

/** 0 이상 1 미만의 난수를 돌려주는 함수 (테스트에서 고정값을 넣을 수 있게 분리) */
export type RandomFn = () => number;

/** 단계별 선택에 쓰이는 메뉴 필드 (모두 배열) */
export const QUIZ_KEYS = ['mealType', 'cooking', 'taste', 'servings'] as const satisfies readonly QuizKey[];

/* =========================== 랜덤 =========================== */

/** 배열에서 무작위로 하나 고르기 (빈 배열이면 undefined) */
export function pickRandom<T>(items: readonly T[], random: RandomFn = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(random() * items.length)];
}

/** 배열을 섞은 새 배열 (Fisher-Yates) */
export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** 직전 메뉴를 후보에서 제외 (제외하면 비어 버릴 때는 원래 목록 유지) */
export function excludeMenu(menus: readonly ChickenMenu[], excludeId?: string): readonly ChickenMenu[] {
  if (!excludeId) return menus;
  const rest = menus.filter((m) => m.id !== excludeId);
  return rest.length > 0 ? rest : menus;
}

/** 직전 메뉴를 제외하고 무작위로 하나 고르기 */
export function pickRandomMenu(
  menus: readonly ChickenMenu[],
  excludeId?: string,
  random: RandomFn = Math.random,
): ChickenMenu | undefined {
  return pickRandom(excludeMenu(menus, excludeId), random);
}

/* =========================== 조건 기반 =========================== */

/** 답변 중 실제 조건으로 쓰이는 것만 [키, 값] 으로 (미응답, "상관없음" 제외) */
function activeConditions(answers: QuizAnswers): Array<[QuizKey, string]> {
  const result: Array<[QuizKey, string]> = [];
  for (const key of QUIZ_KEYS) {
    const value = answers[key];
    if (value && value !== 'any') result.push([key, value]);
  }
  return result;
}

function menuHas(menu: ChickenMenu, key: QuizKey, value: string): boolean {
  return (menu[key] as readonly string[]).includes(value);
}

/** 모든 조건에 맞는 메뉴만 남기기 ("상관없음" 은 필터에서 제외) */
export function filterMenus(menus: readonly ChickenMenu[], answers: QuizAnswers): ChickenMenu[] {
  const conditions = activeConditions(answers);
  return menus.filter((m) => conditions.every(([key, value]) => menuHas(m, key, value)));
}

/** 일치하는 조건 개수 (점수) */
export function scoreMenu(menu: ChickenMenu, answers: QuizAnswers): number {
  return activeConditions(answers).filter(([key, value]) => menuHas(menu, key, value)).length;
}

/** 가장 많이 일치하는 메뉴들 (동점이면 모두) */
export function topScoredMenus(menus: readonly ChickenMenu[], answers: QuizAnswers): ChickenMenu[] {
  let best = -1;
  let result: ChickenMenu[] = [];
  for (const menu of menus) {
    const score = scoreMenu(menu, answers);
    if (score > best) {
      best = score;
      result = [menu];
    } else if (score === best) {
      result.push(menu);
    }
  }
  return result;
}

export interface QuizRecommendation {
  menu: ChickenMenu;
  /** true: 모든 조건에 딱 맞음 / false: 점수제로 가장 비슷한 메뉴 */
  exact: boolean;
  /** 같은 조건으로 고를 수 있는 후보 전체 */
  candidates: ChickenMenu[];
}

/** 조건에 맞는 후보 목록 (딱 맞는 게 없으면 가장 많이 일치하는 메뉴들) */
export function getQuizCandidates(
  menus: readonly ChickenMenu[],
  answers: QuizAnswers,
): { candidates: ChickenMenu[]; exact: boolean } {
  const matched = filterMenus(menus, answers);
  if (matched.length > 0) return { candidates: matched, exact: true };
  return { candidates: topScoredMenus(menus, answers), exact: false };
}

/** 조건 기반 추천: 후보 중 직전 메뉴를 제외하고 무작위로 하나 */
export function recommendByAnswers(
  menus: readonly ChickenMenu[],
  answers: QuizAnswers,
  excludeId?: string,
  random: RandomFn = Math.random,
): QuizRecommendation | undefined {
  const { candidates, exact } = getQuizCandidates(menus, answers);
  const menu = pickRandomMenu(candidates, excludeId, random);
  return menu ? { menu, exact, candidates } : undefined;
}

/**
 * 앞 단계 답변 기준으로 결과가 1개 이상 나오는 선택지 값
 * - 결과가 0개가 되는 선택지를 화면에서 숨기는 데 사용
 */
export function getAvailableValues(
  menus: readonly ChickenMenu[],
  priorAnswers: QuizAnswers,
  key: QuizKey,
): Set<string> {
  const values = new Set<string>();
  for (const menu of filterMenus(menus, priorAnswers)) {
    for (const value of menu[key]) values.add(value);
  }
  return values;
}
