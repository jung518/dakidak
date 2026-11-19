import type { Restaurant } from '../../types';
import { cx } from '../../utils/cx';
import { formatDistance } from '../../utils/format';
import { ClayButton } from './ClayButton';
import { ClayCard } from './ClayCard';
import styles from './RestaurantCard.module.css';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

/** "음식점 > 한식 > 닭요리" 를 "한식 > 닭요리" 로 줄임 (맨 앞 '음식점'은 생략) */
function shortenCategory(category: string): string {
  const parts = category.split('>').map((p) => p.trim()).filter(Boolean);
  if (parts[0] === '음식점' && parts.length > 1) parts.shift();
  return parts.join(' > ');
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const { name, category, address, distance, phone, placeUrl } = restaurant;
  const distanceText = formatDistance(distance);

  return (
    <ClayCard as="article" color="white" padding="md" className={cx(styles.card, className)}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        {distanceText && <span className={styles.distance}>{distanceText}</span>}
      </div>

      {category && <p className={styles.category}>{shortenCategory(category)}</p>}

      <dl className={styles.info}>
        <div className={styles.row}>
          <dt>주소</dt>
          <dd>{address}</dd>
        </div>
        {phone && (
          <div className={styles.row}>
            <dt>전화</dt>
            <dd>
              <a href={`tel:${phone}`} className={styles.phone}>
                {phone}
              </a>
            </dd>
          </div>
        )}
      </dl>

      <div className={styles.actions}>
        <ClayButton href={placeUrl} variant="secondary" size="sm" fullWidth>
          카카오맵에서 보기
        </ClayButton>
      </div>
    </ClayCard>
  );
}
