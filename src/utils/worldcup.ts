import type { ChickenMenu } from '../types';
import { shuffle, type RandomFn } from './recommend';

/** 기본 대진 크기 (16강) */
export const WORLD_CUP_SIZE = 16;

export interface WorldCupGame {
  /** 시작할 때의 참가 수 (메뉴가 부족하면 줄어들 수 있음) */
  size: number;
  /** 현재 라운드 참가 메뉴 (두 개씩 짝지어 경기) */
  round: ChickenMenu[];
  /** 현재 라운드에서 이긴 메뉴 */
  winners: ChickenMenu[];
  /** 현재 라운드의 몇 번째 경기인지 (0부터) */
  matchIndex: number;
  /** 우승 메뉴 (끝나면 값이 생김) */
  champion?: ChickenMenu;
}

/** n 이하의 가장 큰 2의 거듭제곱 (2 미만이면 0) */
function floorPowerOfTwo(n: number): number {
  if (n < 2) return 0;
  return 2 ** Math.floor(Math.log2(n));
}

/** 메뉴를 섞어서 size 강 대진 만들기 (메뉴가 부족하면 가능한 만큼으로 줄임) */
export function createWorldCup(
  menus: readonly ChickenMenu[],
  size: number = WORLD_CUP_SIZE,
  random: RandomFn = Math.random,
): WorldCupGame {
  const actualSize = Math.min(floorPowerOfTwo(size), floorPowerOfTwo(menus.length));
  const round = shuffle(menus, random).slice(0, actualSize);
  return { size: actualSize, round, winners: [], matchIndex: 0 };
}

/** 지금 겨루는 두 메뉴 (끝났으면 undefined) */
export function getCurrentMatch(game: WorldCupGame): [ChickenMenu, ChickenMenu] | undefined {
  if (game.champion) return undefined;
  const a = game.round[game.matchIndex * 2];
  const b = game.round[game.matchIndex * 2 + 1];
  return a && b ? [a, b] : undefined;
}

/** 한 경기의 승자를 고르고 다음 상태 반환 (원본은 바꾸지 않음) */
export function pickWinner(game: WorldCupGame, winnerId: string): WorldCupGame {
  const match = getCurrentMatch(game);
  const winner = match?.find((m) => m.id === winnerId);
  if (!match || !winner) return game;

  const winners = [...game.winners, winner];
  const matchCount = game.round.length / 2;

  // 라운드가 아직 남음
  if (game.matchIndex + 1 < matchCount) {
    return { ...game, winners, matchIndex: game.matchIndex + 1 };
  }
  // 결승이 끝남
  if (winners.length === 1) {
    return { ...game, winners, champion: winner };
  }
  // 다음 라운드로
  return { ...game, round: winners, winners: [], matchIndex: 0 };
}

/** 라운드 이름 (16강, 8강, 4강, 결승) */
export function getRoundLabel(roundSize: number): string {
  return roundSize <= 2 ? '결승' : `${roundSize}강`;
}

/** 전체 경기 수 (size 강이면 size - 1 경기) */
export function getTotalMatches(game: WorldCupGame): number {
  return Math.max(game.size - 1, 0);
}

/** 지금까지 끝난 경기 수 */
export function getPlayedMatches(game: WorldCupGame): number {
  if (game.champion) return getTotalMatches(game);
  // 한 경기마다 한 메뉴가 탈락하므로, 이전 라운드까지 탈락한 수 = 끝난 경기 수
  return game.size - game.round.length + game.matchIndex;
}
