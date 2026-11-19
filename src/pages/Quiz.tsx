import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClayButton,
  MenuCard,
  MenuShuffle,
  OptionCard,
  PageLayout,
  ProgressBar,
} from '../components/common';
import { MENUS } from '../data/menus';
import { ANY_OPTION, QUIZ_STEPS } from '../data/quiz';
import { useQuizRecommend } from '../hooks/useRecommend';
import type { QuizAnswers } from '../types';
import { getAvailableValues } from '../utils/recommend';
import styles from './Quiz.module.css';

const TOTAL_STEPS = QUIZ_STEPS.length;
const NOT_EXACT_MESSAGE = '딱 맞는 건 없지만 이건 어때요?';

/* =========================== 상태 =========================== */

interface QuizState {
  /** 0 ~ TOTAL_STEPS-1: 질문 단계 / TOTAL_STEPS: 결과 */
  step: number;
  answers: QuizAnswers;
}

type QuizAction =
  | { type: 'select'; step: number; value: string }
  | { type: 'back' }
  | { type: 'reset' };

const initialState: QuizState = { step: 0, answers: {} };

/** 앞에서부터 count 개 단계의 답변만 남기기 */
function takeAnswers(answers: QuizAnswers, count: number): QuizAnswers {
  const result: Record<string, string> = {};
  for (const { key } of QUIZ_STEPS.slice(0, count)) {
    const value = answers[key];
    if (value) result[key] = value;
  }
  return result as QuizAnswers;
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'select': {
      const step = QUIZ_STEPS[action.step];
      if (!step) return state;
      // 이전 단계로 돌아가 다시 고르면 뒤 단계 답변은 지움
      const answers = { ...takeAnswers(state.answers, action.step), [step.key]: action.value } as QuizAnswers;
      return { step: action.step + 1, answers };
    }
    case 'back':
      return { ...state, step: Math.max(0, state.step - 1) };
    case 'reset':
      return initialState;
  }
}

/* =========================== 페이지 =========================== */

export default function Quiz() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const isResult = state.step >= TOTAL_STEPS;
  const currentStep = QUIZ_STEPS[state.step];

  const { menu, exact, candidates, isShuffling, reroll } = useQuizRecommend({
    answers: state.answers,
    enabled: isResult,
    shuffleMs: reduceMotion ? 300 : 800,
  });

  // 앞 단계 답변 기준으로 결과가 나오는 선택지만 표시
  const visibleOptions = useMemo(() => {
    if (!currentStep) return [];
    const available = getAvailableValues(MENUS, takeAnswers(state.answers, state.step), currentStep.key);
    const options = (currentStep.options as Array<{ value: string; label: string; description?: string }>).filter(
      (o) => available.has(o.value),
    );
    return [...options, ANY_OPTION];
  }, [currentStep, state.answers, state.step]);

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 32 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -32 } };

  const ready = isResult && !isShuffling && menu !== undefined;
  const onlyOne = candidates.length < 2;

  return (
    <PageLayout
      narrow
      bottomBar={
        isResult ? (
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
            <ClayButton variant="secondary" fullWidth loading={isShuffling} disabled={onlyOne} onClick={reroll}>
              같은 조건으로 다시 추천
            </ClayButton>
            <ClayButton variant="ghost" fullWidth onClick={() => dispatch({ type: 'reset' })}>
              처음부터 다시 고르기
            </ClayButton>
          </>
        ) : undefined
      }
    >
      <div className={styles.page}>
        {!isResult && (
          <div className={styles.topBar}>
            <ClayButton
              variant="ghost"
              size="sm"
              onClick={() => (state.step === 0 ? navigate('/') : dispatch({ type: 'back' }))}
            >
              {state.step === 0 ? '처음으로' : '이전 단계'}
            </ClayButton>
            <ProgressBar current={state.step + 1} total={TOTAL_STEPS} className={styles.progress} />
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {currentStep ? (
            <motion.section
              key={`step-${state.step}`}
              className={styles.question}
              aria-labelledby="quiz-question"
              transition={{ duration: 0.22, ease: 'easeOut' }}
              {...slide}
            >
              <p className={styles.stepLabel}>
                {state.step + 1}단계 / {TOTAL_STEPS}단계
              </p>
              <h1 id="quiz-question" className={styles.title}>
                {currentStep.question}
              </h1>

              <div className={styles.options} role="group" aria-labelledby="quiz-question">
                {visibleOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    description={option.description}
                    selected={state.answers[currentStep.key] === option.value}
                    onClick={() => dispatch({ type: 'select', step: state.step, value: option.value })}
                  />
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="result"
              className={styles.result}
              aria-labelledby="quiz-result"
              transition={{ duration: 0.22, ease: 'easeOut' }}
              {...slide}
            >
              <h1 id="quiz-result" className={styles.title}>
                {ready ? '이런 닭요리 어때요?' : '딱 맞는 닭요리를 찾는 중'}
              </h1>

              <div className={styles.stage} aria-live="polite">
                {ready ? (
                  <MenuCard menu={menu} message={exact ? undefined : NOT_EXACT_MESSAGE} />
                ) : (
                  <MenuShuffle
                    candidates={candidates.length > 1 ? candidates : MENUS}
                    animated={!reduceMotion}
                    label="조건에 맞는 닭요리를 고르는 중"
                  />
                )}
              </div>

              {ready && onlyOne && <p className={styles.note}>이 조건에 맞는 메뉴는 이거 하나예요.</p>}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
