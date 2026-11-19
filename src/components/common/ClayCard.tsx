import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './ClayCard.module.css';

export type ClayCardColor = 'yellow' | 'orange' | 'white';
export type ClayCardPadding = 'none' | 'sm' | 'md' | 'lg';
export type ClayCardElement = 'div' | 'section' | 'article' | 'li';

export interface ClayCardProps extends HTMLAttributes<HTMLElement> {
  color?: ClayCardColor;
  padding?: ClayCardPadding;
  /** true 이면 hover 시 떠오르고 누르면 눌리는 효과 */
  interactive?: boolean;
  /** 렌더링할 HTML 태그 */
  as?: ClayCardElement;
  children?: ReactNode;
}

export function ClayCard({
  color = 'white',
  padding = 'md',
  interactive = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: ClayCardProps) {
  return (
    <Tag
      {...rest}
      className={cx(
        styles.card,
        styles[color],
        styles[`padding-${padding}`],
        interactive && styles.interactive,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
