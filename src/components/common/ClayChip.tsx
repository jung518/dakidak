import { cx } from '../../utils/cx';
import styles from './ClayChip.module.css';

export type ClayChipSize = 'sm' | 'md';

export interface ClayChipProps {
  label: string;
  /** 선택 상태 (선택지 칩으로 쓸 때) */
  selected?: boolean;
  /** 넘기면 클릭 가능한 버튼, 없으면 단순 태그(span)로 렌더링 */
  onClick?: () => void;
  size?: ClayChipSize;
  className?: string;
}

export function ClayChip({ label, selected = false, onClick, size = 'sm', className }: ClayChipProps) {
  const classNames = cx(
    styles.chip,
    styles[size],
    selected && styles.selected,
    onClick && styles.clickable,
    className,
  );

  if (onClick) {
    return (
      <button type="button" className={classNames} aria-pressed={selected} onClick={onClick}>
        {label}
      </button>
    );
  }

  return <span className={classNames}>{label}</span>;
}
