import type { ChickenMenu } from '../../types';
import { cx } from '../../utils/cx';
import styles from './MenuChoiceCard.module.css';

export type MenuChoiceState = 'idle' | 'picked' | 'dropped';

export interface MenuChoiceCardProps {
  menu: ChickenMenu;
  onClick: () => void;
  /** 고른 직후 강조(picked) / 탈락(dropped) 표시 */
  state?: MenuChoiceState;
  disabled?: boolean;
  className?: string;
}

/**
 * 두 메뉴 중 하나를 고를 때 쓰는 메뉴 카드 (카드 전체가 버튼)
 * - 이름과 한 줄 설명만 표시, 실제 사진(menu.image)이 있을 때만 이미지 표시
 */
export function MenuChoiceCard({ menu, onClick, state = 'idle', disabled = false, className }: MenuChoiceCardProps) {
  return (
    <button
      type="button"
      className={cx(styles.card, styles[state], className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${menu.name} 고르기`}
    >
      {menu.image && (
        <span className={styles.visual} aria-hidden="true">
          <img src={menu.image} alt="" className={styles.image} />
        </span>
      )}
      <span className={styles.name}>{menu.name}</span>
      <span className={styles.description}>{menu.description}</span>
    </button>
  );
}
