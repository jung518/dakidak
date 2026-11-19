import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './OptionCard.module.css';

export type OptionCardSize = 'md' | 'lg';
export type OptionCardColor = 'yellow' | 'white';

export interface OptionCardProps {
  /** 이모지 또는 아이콘 요소 */
  icon?: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  selected?: boolean;
  /** md: 단계별 선택지 / lg: 홈 모드 선택 카드 */
  size?: OptionCardSize;
  color?: OptionCardColor;
  className?: string;
}

export function OptionCard({
  icon,
  title,
  description,
  onClick,
  selected = false,
  size = 'md',
  color = 'white',
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={cx(styles.card, styles[size], styles[color], selected && styles.selected, className)}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </button>
  );
}
