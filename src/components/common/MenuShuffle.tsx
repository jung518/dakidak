import { useEffect, useState } from 'react';
import type { ChickenMenu } from '../../types';
import { cx } from '../../utils/cx';
import { pickRandom } from '../../utils/recommend';
import { ClayCard } from './ClayCard';
import styles from './MenuShuffle.module.css';

export interface MenuShuffleProps {
  /** 셔플 중 번갈아 보여줄 메뉴 후보 */
  candidates: readonly ChickenMenu[];
  /** 이름이 바뀌는 간격(ms) */
  interval?: number;
  /** false 이면 이름을 바꾸지 않고 안내 문구만 표시 (모션 최소화 등) */
  animated?: boolean;
  /** 화면에 보여줄 안내 문구 */
  label?: string;
  className?: string;
}

/** 메뉴를 고르는 동안 이름이 빠르게 바뀌는 셔플 카드 */
export function MenuShuffle({
  candidates,
  interval = 80,
  animated = true,
  label = '오늘의 닭요리를 고르는 중',
  className,
}: MenuShuffleProps) {
  const [current, setCurrent] = useState(() => pickRandom(candidates));

  useEffect(() => {
    if (!animated || candidates.length < 2) return;
    const id = window.setInterval(() => {
      setCurrent((prev) => {
        const others = candidates.filter((m) => m.id !== prev?.id);
        return pickRandom(others) ?? prev;
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [animated, candidates, interval]);

  const name = animated ? current?.name : undefined;

  return (
    <ClayCard color="yellow" padding="lg" className={cx(styles.card, className)} aria-busy="true">
      <p className="sr-only" role="status">
        {label}
      </p>
      <div className={styles.body} aria-hidden="true">
        <div className={cx(styles.visual, animated && styles.spinning)}>
          <span className={styles.initial}>{name ? Array.from(name)[0] : '?'}</span>
        </div>
        <p className={styles.name}>{name ?? '두구두구...'}</p>
        <p className={styles.label}>{label}</p>
      </div>
    </ClayCard>
  );
}
