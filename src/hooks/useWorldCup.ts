import { useCallback, useReducer } from 'react';
import { MENUS } from '../data/menus';
import type { ChickenMenu } from '../types';
import { createWorldCup, pickWinner, WORLD_CUP_SIZE, type WorldCupGame } from '../utils/worldcup';

interface WorldCupState {
  game: WorldCupGame;
  /** 이전 경기로 되돌리기 위한 기록 */
  history: WorldCupGame[];
}

type WorldCupAction =
  | { type: 'pick'; menuId: string }
  | { type: 'undo' }
  | { type: 'restart'; menus: readonly ChickenMenu[]; size: number };

function reducer(state: WorldCupState, action: WorldCupAction): WorldCupState {
  switch (action.type) {
    case 'pick': {
      const next = pickWinner(state.game, action.menuId);
      if (next === state.game) return state;
      return { game: next, history: [...state.history, state.game] };
    }
    case 'undo': {
      const previous = state.history[state.history.length - 1];
      if (!previous) return state;
      return { game: previous, history: state.history.slice(0, -1) };
    }
    case 'restart':
      return { game: createWorldCup(action.menus, action.size), history: [] };
  }
}

export interface UseWorldCupOptions {
  menus?: readonly ChickenMenu[];
  /** 몇 강으로 시작할지 (기본 16강) */
  size?: number;
}

export interface UseWorldCupResult {
  game: WorldCupGame;
  canUndo: boolean;
  pick: (menuId: string) => void;
  undo: () => void;
  /** 새 대진으로 처음부터 다시 */
  restart: () => void;
}

/** 닭요리 월드컵 진행 상태 관리 (마운트하자마자 대진을 만들어 바로 시작) */
export function useWorldCup({ menus = MENUS, size = WORLD_CUP_SIZE }: UseWorldCupOptions = {}): UseWorldCupResult {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    game: createWorldCup(menus, size),
    history: [],
  }));

  const pick = useCallback((menuId: string) => dispatch({ type: 'pick', menuId }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const restart = useCallback(() => dispatch({ type: 'restart', menus, size }), [menus, size]);

  return { game: state.game, canUndo: state.history.length > 0, pick, undo, restart };
}
