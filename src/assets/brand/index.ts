/**
 * 브랜드 이미지 자동 감지
 * - 이 폴더에 아래 이름의 파일을 넣으면 자동으로 적용됩니다. (svg / webp / png 순서로 찾음)
 *   logo            헤더, 홈 화면 제목 (가로형 워드마크)
 *   character       홈 화면 캐릭터
 *   chef-{조리법}    메뉴 카드 그림 (soup, stirfry, fried, grilled, braised)
 *   chef-{상황}      thinking(셔플 중), empty(식당 없음), lost(404), oops(오류)
 * - 원본 이미지는 source/ 폴더에 보관 (사이트에는 포함되지 않음)
 * - import.meta.glob 은 실제 있는 파일만 가져오므로 파일이 없어도 빌드 오류가 나지 않고 기본 모양으로 표시됩니다.
 */
import type { Cooking } from '../../types';

const files = import.meta.glob<string>('./*.{svg,webp,png}', { eager: true, import: 'default' });
const EXTENSIONS = ['svg', 'webp', 'png'] as const;

function findImage(name: string): string | undefined {
  for (const ext of EXTENSIONS) {
    const src = files[`./${name}.${ext}`];
    if (src) return src;
  }
  return undefined;
}

export const logoSrc: string | undefined = findImage('logo');
export const characterSrc: string | undefined = findImage('character');

/** 요리사 닭 그림 종류: 조리법 5종 + 상황 4종 */
export type ChefPose = Cooking | 'thinking' | 'empty' | 'lost' | 'oops';

export function getChefImage(pose: ChefPose): string | undefined {
  return findImage(`chef-${pose}`);
}
