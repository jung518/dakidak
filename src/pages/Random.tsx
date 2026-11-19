import { useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ClayButton, MenuCard, MenuShuffle, PageLayout } from '../components/common';
import { MENUS } from '../data/menus';
import { useRandomRecommend } from '../hooks/useRecommend';
import styles from './Random.module.css';

export default function Random() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { menu, isShuffling, reroll } = useRandomRecommend({
    shuffleMs: reduceMotion ? 300 : 1000,
  });

  const ready = !isShuffling && menu !== undefined;

  return (
    <PageLayout
      narrow
      bottomBar={
        <>
          <ClayButton
            variant="primary"
            size="lg"
            fullWidth
            disabled={!ready}
            onClick={() => menu && navigate(`/result/${menu.id}`)}
          >
            이 메뉴 파는 식당 찾기
          </ClayButton>
          <ClayButton variant="secondary" fullWidth loading={isShuffling} onClick={reroll}>
            다시 추천하기
          </ClayButton>
          <ClayButton variant="ghost" fullWidth onClick={() => navigate('/')}>
            처음으로
          </ClayButton>
        </>
      }
    >
      <div className={styles.page}>
        <h1 className={styles.title}>{ready ? '오늘의 닭요리는 바로' : '오늘은 어떤 닭요리일까?'}</h1>

        <div className={styles.stage} aria-live="polite">
          {ready ? (
            <MenuCard menu={menu} />
          ) : (
            <MenuShuffle candidates={MENUS} animated={!reduceMotion} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
