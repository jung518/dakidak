import { Component, type ErrorInfo, type ReactNode } from 'react';
import { getChefImage } from '../../assets/brand';
import { ClayButton } from './ClayButton';
import { EmptyState } from './EmptyState';
import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** 직접 지정하는 대체 화면 (없으면 기본 안내) */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * 렌더링 중 예상하지 못한 오류가 나면 흰 화면 대신 안내를 보여줌
 * - 페이지를 이동하면(key 변경) 자동으로 초기화되도록 App 에서 key 를 넘겨 사용
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleRetry = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <main className={styles.wrapper}>
        <EmptyState
          tone="error"
          image={getChefImage('oops')}
          title="앗, 잠시 문제가 생겼어요"
          description="화면을 불러오는 중에 오류가 났어요. 다시 시도하거나 처음으로 돌아가 주세요."
          action={
            <>
              <ClayButton onClick={this.handleRetry}>다시 시도</ClayButton>
              <ClayButton variant="secondary" onClick={() => window.location.assign('/')}>
                처음으로
              </ClayButton>
            </>
          }
        />
      </main>
    );
  }
}
