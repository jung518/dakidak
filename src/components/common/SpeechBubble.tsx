import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './SpeechBubble.module.css';

export type SpeechBubbleTail = 'bottom' | 'top' | 'none';

export interface SpeechBubbleProps {
  children: ReactNode;
  /** 꼬리 방향 (말하는 캐릭터가 있는 쪽) */
  tail?: SpeechBubbleTail;
  /** 렌더링할 태그 */
  as?: 'p' | 'div';
  className?: string;
}

/** 캐릭터 대사용 클레이 말풍선 */
export function SpeechBubble({ children, tail = 'bottom', as: Tag = 'p', className }: SpeechBubbleProps) {
  return (
    <Tag className={cx(styles.bubble, tail !== 'none' && styles[`tail-${tail}`], className)}>{children}</Tag>
  );
}
