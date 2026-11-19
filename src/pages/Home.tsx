import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { hasLogoImage, Logo, Mascot, OptionCard, PageLayout, SpeechBubble } from '../components/common';
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
    // 홈은 본문에 큰 로고가 있으므로 헤더 로고를 숨겨 중복을 피함
    <PageLayout showHeader={false}>
      <motion.div className={styles.page} variants={container} initial="hidden" animate="show">
        <section className={styles.hero} aria-labelledby="home-title">
          {/* 1. 서비스 이름 */}
          <motion.h1 id="home-title" className={styles.title} variants={item}>
            {/* 로고 이미지가 있으면 이미지(alt: 오늘도 닭이닭), 없으면 글자 */}
            {hasLogoImage ? <Logo size="lg" /> : '오늘도 닭이닭'}
          </motion.h1>

          {/* 2. 캐릭터가 슬로건을 말하는 장면 */}
          <div className={styles.greeting}>
            <motion.div variants={item}>
              <SpeechBubble tail="bottom">
                오늘 뭐 먹지?
                <br />
                <span className={styles.sloganAccent}>오늘도 닭이지!</span>
              </SpeechBubble>
            </motion.div>
            <motion.div variants={item}>
              <Mascot size="md" animated />
            </motion.div>
          </div>
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

        {/* 부가 기능: 메인 카드보다 작게 */}
        <motion.div className={styles.extra} variants={item}>
          <Link to="/worldcup" className={styles.extraLink}>
            닭요리 월드컵 하러 가기
          </Link>
        </motion.div>

        <motion.footer className={styles.intro} variants={item}>
          <p>
            닭을 사랑하는 사람들을 위한, <strong>닭요리만</strong> 추천해 주는 서비스예요.
          </p>
        </motion.footer>
      </motion.div>
    </PageLayout>
  );
}
