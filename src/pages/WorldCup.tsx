import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayButton, MenuCard, MenuChoiceCard, PageLayout, ProgressBar } from '../components/common';
import { useWorldCup } from '../hooks/useWorldCup';
import { getCurrentMatch, getPlayedMatches, getRoundLabel, getTotalMatches } from '../utils/worldcup';
import styles from './WorldCup.module.css';

/** 고른 카드를 잠깐 강조한 뒤 다음 경기로 넘어가는 시간(ms) */
const PICK_DELAY_MS = 320;

export default function WorldCup() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { game, canUndo, pick, undo, restart } = useWorldCup();
  const [pickedId, setPickedId] = useState<string>();
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const match = getCurrentMatch(game);
  const champion = game.champion;

  const handlePick = (menuId: string) => {
    if (pickedId) return;
    if (reduceMotion) {
      pick(menuId);
      return;
    }
    setPickedId(menuId);
    timerRef.current = window.setTimeout(() => {
      pick(menuId);
      setPickedId(undefined);
    }, PICK_DELAY_MS);
  };

  const choiceState = (menuId: string) => (pickedId ? (pickedId === menuId ? 'picked' : 'dropped') : 'idle');

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

  return (
    <PageLayout
      narrow={!match}
      bottomBar={
        champion ? (
          <>
            <ClayButton variant="primary" size="lg" fullWidth onClick={() => navigate(`/result/${champion.id}`)}>
              이 메뉴 파는 식당 찾기
            </ClayButton>
            <ClayButton variant="secondary" fullWidth onClick={restart}>
              다시 하기
            </ClayButton>
            <ClayButton variant="ghost" fullWidth onClick={() => navigate('/')}>
              처음으로
            </ClayButton>
          </>
        ) : undefined
      }
    >
      <div className={styles.page}>
        {/* ---------- 경기 화면 ---------- */}
        {match && (
          <>
            <div className={styles.topBar}>
              <ClayButton
                variant="ghost"
                size="sm"
                onClick={canUndo ? undo : () => navigate('/')}
                disabled={pickedId !== undefined}
              >
                이전으로
              </ClayButton>
              <ProgressBar
                current={getPlayedMatches(game) + 1}
                total={getTotalMatches(game)}
                className={styles.progress}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={`${game.round.length}-${game.matchIndex}`}
                className={styles.match}
                aria-labelledby="match-title"
                transition={{ duration: 0.2, ease: 'easeOut' }}
                {...slide}
              >
                <div className={styles.matchHead}>
                  <p className={styles.eyebrow}>닭요리 월드컵</p>
                  <h1 id="match-title" className={styles.roundTitle}>
                    {getRoundLabel(game.round.length)}
                    {game.round.length > 2 && (
                      <span className={styles.roundCount}>
                        {' '}
                        {game.matchIndex + 1} / {game.round.length / 2}
                      </span>
                    )}
                  </h1>
                  <p className={styles.hint}>더 끌리는 메뉴를 골라 주세요</p>
                </div>

                <div className={styles.versus}>
                  <MenuChoiceCard
                    menu={match[0]}
                    onClick={() => handlePick(match[0].id)}
                    state={choiceState(match[0].id)}
                    disabled={pickedId !== undefined}
                  />
                  <span className={styles.vs} aria-hidden="true">
                    VS
                  </span>
                  <MenuChoiceCard
                    menu={match[1]}
                    onClick={() => handlePick(match[1].id)}
                    state={choiceState(match[1].id)}
                    disabled={pickedId !== undefined}
                  />
                </div>
              </motion.section>
            </AnimatePresence>
          </>
        )}

        {/* ---------- 우승 화면 ---------- */}
        {champion && (
          <section className={styles.done} aria-labelledby="champion-title">
            <h1 id="champion-title" className={styles.title}>
              우승 닭요리는 바로
            </h1>
            <MenuCard menu={champion} message={`${getRoundLabel(game.size)}을 뚫고 올라온 오늘의 닭요리`} />
          </section>
        )}
      </div>
    </PageLayout>
  );
}
