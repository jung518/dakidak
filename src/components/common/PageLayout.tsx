import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cx } from '../../utils/cx';
import { ClayButton } from './ClayButton';
import { Header } from './Header';
import styles from './PageLayout.module.css';

export interface PageLayoutProps {
  children: ReactNode;
  /** 헤더 아래에 "이전으로" 버튼 표시 */
  showBack?: boolean;
  /** 뒤로가기 동작을 직접 지정 (기본: 브라우저 뒤로가기, 기록이 없으면 홈) */
  onBack?: () => void;
  /** 모바일에서 화면 하단에 고정되는 버튼 영역 (태블릿 이상에서는 본문 아래에 표시) */
  bottomBar?: ReactNode;
  /** 본문 최대 너비를 좁게 (단계별 선택 등 1열 화면용) */
  narrow?: boolean;
  className?: string;
}

export function PageLayout({ children, showBack = false, onBack, bottomBar, narrow = false, className }: PageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) return onBack();
    // 앱 안에서 이동한 기록이 없으면(직접 접속) 홈으로
    if (location.key === 'default') navigate('/');
    else navigate(-1);
  };

  return (
    <div className={styles.layout}>
      <Header />
      <main className={cx(styles.main, narrow && styles.narrow, className)}>
        {showBack && (
          <div className={styles.backRow}>
            <ClayButton variant="ghost" size="sm" onClick={handleBack}>
              이전으로
            </ClayButton>
          </div>
        )}
        {children}
      </main>
      {bottomBar && (
        <div className={styles.bottomBar}>
          <div className={cx(styles.bottomInner, narrow && styles.narrow)}>{bottomBar}</div>
        </div>
      )}
    </div>
  );
}
