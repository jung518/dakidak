import { useNavigate } from 'react-router-dom';
import { ClayButton, EmptyState, PageLayout } from '../components/common';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageLayout narrow>
      <div className={styles.page}>
        <EmptyState
          icon="🐣"
          title="앗, 길을 잃은 병아리예요"
          description="찾으시는 페이지가 없어요. 홈으로 돌아가서 오늘의 닭요리를 골라 볼까요?"
          action={
            <ClayButton icon="🏠" onClick={() => navigate('/')}>
              처음으로
            </ClayButton>
          }
        />
      </div>
    </PageLayout>
  );
}
