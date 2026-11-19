import { logoSrc } from '../../assets/brand';
import { cx } from '../../utils/cx';
import styles from './Logo.module.css';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  size?: LogoSize;
  /** 원 안에 "닭이닭" 텍스트 표시 여부 (sm 에서는 기본 숨김) */
  showText?: boolean;
  className?: string;
}

/** 임시 로고: 클레이 원 + 🐔 + "닭이닭". logo.svg 가 있으면 이미지로 대체 */
export function Logo({ size = 'md', showText, className }: LogoProps) {
  const withText = showText ?? size !== 'sm';

  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt="오늘도 닭이닭 로고"
        className={cx(styles.logo, styles.image, styles[size], className)}
      />
    );
  }

  return (
    <span className={cx(styles.logo, styles[size], className)} role="img" aria-label="오늘도 닭이닭 로고">
      <span className={styles.emoji} aria-hidden="true">
        🐔
      </span>
      {withText && (
        <span className={styles.text} aria-hidden="true">
          닭이닭
        </span>
      )}
    </span>
  );
}
