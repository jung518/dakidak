import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mascot, OptionCard, PageLayout } from '../components/common';
import styles from './Home.module.css';

const MODES = [
  {
    path: '/random',
    title: '랜덤으로 고르기',
    description: '고민은 그만! 랜덤으로 오늘의 닭요리를 뽑아 줄게요.',
    color: 'yellow',
  },
  {
    path: '/quiz',
    title: '취향대로 고르기',
    description: '4가지 질문에 답하면 지금 딱 끌리는 닭요리를 찾아 줘요.',
    color: 'white',
  },
] as const;

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
  };
  const item: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  };

  return (
    <PageLayout>
      <motion.div className={styles.page} variants={container} initial="hidden" animate="show">
        <section className={styles.hero} aria-labelledby="home-title">
          <motion.div variants={item}>
            <Mascot size="lg" animated />
          </motion.div>
          <motion.h1 id="home-title" className={styles.title} variants={item}>
            오늘도 닭이닭
          </motion.h1>
          <motion.p className={styles.subtitle} variants={item}>
            오늘 뭐 먹지? 오늘도 닭이지!
          </motion.p>
        </section>

        <section className={styles.modes} aria-label="추천 방식 선택">
          {MODES.map((mode) => (
            <motion.div key={mode.path} variants={item}>
              <OptionCard
                size="lg"
                color={mode.color}
                title={mode.title}
                description={mode.description}
                onClick={() => navigate(mode.path)}
                className={styles.modeCard}
              />
            </motion.div>
          ))}
        </section>

        <motion.footer className={styles.intro} variants={item}>
          <p>
            닭을 사랑하는 사람들을 위한, <strong>닭요리만</strong> 추천해 주는 서비스예요.
          </p>
        </motion.footer>
      </motion.div>
    </PageLayout>
  );
}
