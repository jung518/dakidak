import { logoSrc } from '../../assets/brand';
import { cx } from '../../utils/cx';
import styles from './Logo.module.css';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  size?: LogoSize;
  className?: string;
}

/** 로고 이미지(가로형 워드마크)가 있는지. 있으면 헤더에서 글자를 따로 쓰지 않음 */
export const hasLogoImage = Boolean(logoSrc);

/**
 * 로고
 * - src/assets/brand/logo.* 가 있으면 워드마크 이미지 (높이 기준으로 크기 결정)
 * - 없으면 임시 로고: 클레이 원 + 볏 + 글자 ("닭" / "닭이닭")
 */
export function Logo({ size = 'md', className }: LogoProps) {
  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt="오늘도 닭이닭"
        className={cx(styles.wordmark, styles[`wordmark-${size}`], className)}
        decoding="async"
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
