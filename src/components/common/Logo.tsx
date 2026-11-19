import { logoSrc } from '../../assets/brand';
import { cx } from '../../utils/cx';
import styles from './Logo.module.css';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  size?: LogoSize;
  className?: string;
}

/**
 * 임시 로고: 클레이 원 + 글자 ("닭" / "닭이닭")
 * src/assets/brand/logo.svg 가 있으면 이미지로 대체
 */
export function Logo({ size = 'md', className }: LogoProps) {
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
      <span className={styles.comb} aria-hidden="true" />
      <span className={styles.text} aria-hidden="true">
        {size === 'sm' ? '닭' : '닭이닭'}
      </span>
    </span>
  );
}
