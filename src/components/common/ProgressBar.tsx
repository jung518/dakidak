import { cx } from '../../utils/cx';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  /** 현재 단계 (1부터 시작) */
  current: number;
  total: number;
  /** "1/4" 텍스트 표시 여부 */
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ current, total, showLabel = true, className }: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  const percent = (safeCurrent / safeTotal) * 100;

  return (
    <div className={cx(styles.wrapper, className)}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        aria-label={`${safeTotal}단계 중 ${safeCurrent}단계`}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
      {showLabel && (
        <span className={styles.label} aria-hidden="true">
          {safeCurrent}/{safeTotal}
        </span>
      )}
    </div>
  );
}
