import { motion, useReducedMotion } from 'framer-motion';
import type { ChickenMenu } from '../../types';
import { cx } from '../../utils/cx';
import { getMenuTags } from '../../utils/format';
import { ClayCard } from './ClayCard';
import { ClayChip } from './ClayChip';
import styles from './MenuCard.module.css';

export interface MenuCardProps {
  menu: ChickenMenu;
  /** 카드 위에 보여줄 안내 문구 (예: "딱 맞는 건 없지만 이건 어때요?") */
  message?: string;
  className?: string;
}

/** 추천된 닭요리 카드: 이모지(또는 이미지), 이름, 한 줄 설명, 태그 */
export function MenuCard({ menu, message, className }: MenuCardProps) {
  const reduceMotion = useReducedMotion();
  const tags = getMenuTags(menu);

  return (
    <ClayCard as="article" color="yellow" padding="lg" className={cx(styles.card, className)}>
      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}

      {/* key 가 바뀔 때마다(다시 추천) 등장 애니메이션 재생 */}
      <motion.div
        key={menu.id}
        className={styles.body}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <div className={styles.visual}>
          {menu.image ? (
            <img src={menu.image} alt="" className={styles.image} />
          ) : (
            <span className={styles.emoji} aria-hidden="true">
              {menu.emoji}
            </span>
          )}
        </div>

        <h2 className={styles.name}>{menu.name}</h2>
        <p className={styles.description}>{menu.description}</p>

        <ul className={styles.tags} aria-label="메뉴 특징">
          {tags.map((tag) => (
            <li key={tag}>
              <ClayChip label={`#${tag}`} />
            </li>
          ))}
        </ul>
      </motion.div>
    </ClayCard>
  );
}
