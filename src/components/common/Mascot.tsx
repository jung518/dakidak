import { motion, useReducedMotion } from 'framer-motion';
import { characterSrc } from '../../assets/brand';
import { cx } from '../../utils/cx';
import styles from './Mascot.module.css';

export type MascotSize = 'sm' | 'md' | 'lg';

export interface MascotProps {
  size?: MascotSize;
  /** 위아래로 둥실거리는 애니메이션 */
  animated?: boolean;
  className?: string;
}

/**
 * 임시 대표 캐릭터: 큰 클레이 원에 CSS 로 그린 병아리 얼굴
 * src/assets/brand/character.png 가 있으면 이미지로 대체
 */
export function Mascot({ size = 'lg', animated = true, className }: MascotProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;

  return (
    <motion.div
      className={cx(styles.mascot, styles[size], characterSrc && styles.withImage, className)}
      animate={shouldAnimate ? { y: [0, -14, 0] } : { y: 0 }}
      transition={shouldAnimate ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      role="img"
      aria-label="닭이닭 캐릭터"
    >
      {characterSrc ? (
        <img src={characterSrc} alt="" className={styles.image} />
      ) : (
        <span className={styles.face} aria-hidden="true">
          <span className={cx(styles.eye, styles.eyeLeft)} />
          <span className={cx(styles.eye, styles.eyeRight)} />
          <span className={cx(styles.cheek, styles.cheekLeft)} />
          <span className={cx(styles.cheek, styles.cheekRight)} />
          <span className={styles.beak} />
        </span>
      )}
    </motion.div>
  );
}
