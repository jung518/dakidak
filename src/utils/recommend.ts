import type { ChickenMenu } from '../types';

/** 0 이상 1 미만의 난수를 돌려주는 함수 (테스트에서 고정값을 넣을 수 있게 분리) */
export type RandomFn = () => number;

/** 배열에서 무작위로 하나 고르기 (빈 배열이면 undefined) */
export function pickRandom<T>(items: readonly T[], random: RandomFn = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(random() * items.length)];
}

/**
 * 직전 메뉴를 제외하고 무작위로 하나 고르기
 * - 후보가 직전 메뉴 하나뿐이면 어쩔 수 없이 그 메뉴를 돌려줌
 */
export function pickRandomMenu(
  menus: readonly ChickenMenu[],
  excludeId?: string,
  random: RandomFn = Math.random,
): ChickenMenu | undefined {
  const candidates = excludeId ? menus.filter((m) => m.id !== excludeId) : menus;
  return pickRandom(candidates.length > 0 ? candidates : menus, random);
}
