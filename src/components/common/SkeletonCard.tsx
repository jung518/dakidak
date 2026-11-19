import { cx } from '../../utils/cx';
import { ClayCard } from './ClayCard';
import styles from './SkeletonCard.module.css';

export interface SkeletonCardProps {
  /** 제목 아래 본문 줄 수 */
  lines?: number;
  /** 하단 버튼 자리 표시 */
  showActions?: boolean;
  className?: string;
}

/** 로딩 중 자리 표시용 카드 */
export function SkeletonCard({ lines = 3, showActions = true, className }: SkeletonCardProps) {
  return (
    <ClayCard color="white" padding="md" className={cx(styles.card, className)} aria-hidden="true">
      <div className={cx(styles.bar, styles.title)} />
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={cx(styles.bar, styles.line, i === lines - 1 && styles.short)} />
      ))}
      {showActions && (
        <div className={styles.actions}>
          <div className={cx(styles.bar, styles.button)} />
          <div className={cx(styles.bar, styles.button)} />
        </div>
      )}
    </ClayCard>
  );
}
