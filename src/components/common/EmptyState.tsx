import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { ClayCard } from './ClayCard';
import styles from './EmptyState.module.css';

export type EmptyStateTone = 'default' | 'error';

export interface EmptyStateProps {
  /** 이모지 또는 아이콘 */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** 버튼 등 행동 유도 영역 */
  action?: ReactNode;
  /** error 이면 스크린 리더에 즉시 알림(role="alert") */
  tone?: EmptyStateTone;
  className?: string;
}

/** 결과 없음, 에러, 안내 메시지 */
export function EmptyState({ icon = '🐣', title, description, action, tone = 'default', className }: EmptyStateProps) {
  return (
    <ClayCard
      color="white"
      padding="lg"
      className={cx(styles.card, className)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </ClayCard>
  );
}
