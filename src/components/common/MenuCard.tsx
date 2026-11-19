import { motion, useReducedMotion } from 'framer-motion';
import { getChefImage } from '../../assets/brand';
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

/**
 * 추천된 닭요리 카드: 그림, 이름, 한 줄 설명, 태그
 * - 그림 우선순위: 메뉴 사진(menu.image) → 조리법별 요리사 닭 그림 → 이름 첫 글자
 */
export function MenuCard({ menu, message, className }: MenuCardProps) {
  const reduceMotion = useReducedMotion();
  const tags = getMenuTags(menu);
  const firstCooking = menu.cooking[0];
  const chefImage = firstCooking ? getChefImage(firstCooking) : undefined;

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
        {menu.image ? (
          <div className={styles.visual}>
            <img src={menu.image} alt="" className={styles.image} />
          </div>
        ) : chefImage ? (
          // 메뉴 사진이 없으면 조리법에 맞는 요리사 닭 그림
          <img src={chefImage} alt="" className={styles.illustration} decoding="async" />
        ) : (
          <div className={styles.visual}>
            <span className={styles.initial} aria-hidden="true">
              {Array.from(menu.name)[0]}
            </span>
          </div>
        )}

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
