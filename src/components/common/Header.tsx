import { Link } from 'react-router-dom';
import { hasLogoImage, Logo } from './Logo';
import styles from './Header.module.css';

/** 상단 헤더: 로고 (+ 로고 이미지가 없으면 서비스명 글자). 누르면 홈으로 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="오늘도 닭이닭 홈으로">
          <Logo size="sm" />
          {!hasLogoImage && <span className={styles.title}>오늘도 닭이닭</span>}
        </Link>
      </div>
    </header>
  );
}
