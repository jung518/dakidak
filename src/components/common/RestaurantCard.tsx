import type { Restaurant } from '../../types';
import { cx } from '../../utils/cx';
import { buildDirectionsUrl, formatDistance } from '../../utils/format';
import { ClayButton } from './ClayButton';
import { ClayCard } from './ClayCard';
import { ClayChip } from './ClayChip';
import styles from './RestaurantCard.module.css';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

/** "음식점 > 한식 > 닭요리" → "한식 > 닭요리" (맨 앞 '음식점'은 생략) */
function shortenCategory(category: string): string {
  const parts = category.split('>').map((p) => p.trim()).filter(Boolean);
  if (parts[0] === '음식점' && parts.length > 1) parts.shift();
  return parts.join(' > ');
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const { name, category, address, distance, phone, placeUrl, x, y } = restaurant;
  const distanceText = formatDistance(distance);

  return (
    <ClayCard as="article" color="white" padding="md" className={cx(styles.card, className)}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        {distanceText && <ClayChip label={distanceText} className={styles.distance} />}
      </div>

      {category && <p className={styles.category}>{shortenCategory(category)}</p>}

      <dl className={styles.info}>
        <div className={styles.row}>
          <dt>
            <span aria-hidden="true">📍</span>
            <span className="sr-only">주소</span>
          </dt>
          <dd>{address}</dd>
        </div>
        {phone && (
          <div className={styles.row}>
            <dt>
              <span aria-hidden="true">📞</span>
              <span className="sr-only">전화번호</span>
            </dt>
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
        <ClayButton href={buildDirectionsUrl(name, y, x)} variant="primary" size="sm" fullWidth>
          길찾기
        </ClayButton>
      </div>
    </ClayCard>
  );
}
