import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError, geocode } from '../api/client';
import {
  ClayButton,
  EmptyState,
  LocationInput,
  MenuCard,
  PageLayout,
  RestaurantCard,
  SkeletonCard,
} from '../components/common';
import { getMenuById } from '../data/menus';
import { useGeolocation, type GeolocationStatus } from '../hooks/useGeolocation';
import { SEARCH_RADII, SHOW_COUNT, useRestaurants } from '../hooks/useRestaurants';
import type { ApiErrorCode, Coordinates } from '../types';
import { formatDistance } from '../utils/format';
import styles from './Result.module.css';

interface SearchLocation {
  coords: Coordinates;
  /** 화면 표시용 (예: '현재 위치', '강남역 2호선') */
  label: string;
}

const GEO_NOTICE: Partial<Record<GeolocationStatus, string>> = {
  denied: '위치 권한이 꺼져 있어요. 동네나 역 이름으로 찾아 드릴게요.',
  unavailable: '이 브라우저에서는 현재 위치를 확인할 수 없어요.',
  error: '현재 위치를 확인하지 못했어요. 동네나 역 이름으로 찾아 드릴게요.',
};

const ERROR_COPY: Record<ApiErrorCode, { title: string; description: string }> = {
  rate_limited: { title: '잠깐 쉬었다 갈게요', description: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.' },
  network: { title: '인터넷 연결이 불안정해요', description: '연결 상태를 확인하고 다시 시도해 주세요.' },
  bad_request: { title: '검색 정보가 올바르지 않아요', description: '위치를 다시 설정하고 시도해 주세요.' },
  not_found: { title: '식당 정보를 찾지 못했어요', description: '잠시 후 다시 시도해 주세요.' },
  upstream: { title: '식당 정보를 불러오지 못했어요', description: '잠시 후 다시 시도해 주세요.' },
};

function geocodeErrorMessage(error: unknown, query: string): string {
  if (error instanceof ApiError) {
    if (error.code === 'not_found') return `'${query}'을(를) 찾지 못했어요. 다른 이름으로 입력해 주세요.`;
    if (error.code === 'rate_limited') return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
    if (error.code === 'network') return '네트워크 연결을 확인해 주세요.';
  }
  return '위치를 찾지 못했어요. 잠시 후 다시 시도해 주세요.';
}

function SkeletonGrid() {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {Array.from({ length: SHOW_COUNT }, (_, i) => (
        <li key={i}>
          <SkeletonCard lines={3} />
        </li>
      ))}
    </ul>
  );
}

export default function Result() {
  const { menuId } = useParams();
  const menu = getMenuById(menuId);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const geo = useGeolocation({ auto: menu !== undefined });
  const [manual, setManual] = useState<SearchLocation>();
  const [editing, setEditing] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string>();

  const location: SearchLocation | undefined =
    manual ?? (geo.status === 'success' && geo.coords ? { coords: geo.coords, label: '현재 위치' } : undefined);
  const geoFailed = geo.status === 'denied' || geo.status === 'unavailable' || geo.status === 'error';
  const showInput = editing || (!location && geoFailed);
  const locating = !location && !showInput;

  const search = useRestaurants(menu?.searchKeyword ?? '', location?.coords);

  if (!menu) {
    return (
      <PageLayout narrow>
        <div className={styles.notFound}>
          <EmptyState
            title="메뉴를 찾을 수 없어요"
            description="주소가 잘못되었거나 없어진 메뉴예요. 오늘의 닭요리를 다시 골라 볼까요?"
            action={<ClayButton onClick={() => navigate('/')}>메뉴 다시 고르기</ClayButton>}
          />
        </div>
      </PageLayout>
    );
  }

  const handleLocationSubmit = async (query: string) => {
    setGeocoding(true);
    setGeocodeError(undefined);
    try {
      const result = await geocode(query);
      setManual({ coords: { x: result.x, y: result.y }, label: result.name });
      setEditing(false);
    } catch (error) {
      setGeocodeError(geocodeErrorMessage(error, query));
    } finally {
      setGeocoding(false);
    }
  };

  const useCurrentLocation = () => {
    setManual(undefined);
    setEditing(false);
    setGeocodeError(undefined);
    if (geo.status !== 'success') geo.request();
  };

  const nextRadius = SEARCH_RADII.find((r) => r > search.radius);
  const isLoading = search.status === 'loading' || search.status === 'idle';

  let content;
  if (showInput) {
    const notice = editing ? undefined : GEO_NOTICE[geo.status];
    content = (
      <div className={styles.locationBox}>
        {notice && <p className={styles.notice}>{notice}</p>}
        <LocationInput onSubmit={handleLocationSubmit} loading={geocoding} errorMessage={geocodeError} />
        <div className={styles.locationActions}>
          {geo.status !== 'unavailable' && (
            <ClayButton variant="ghost" size="sm" onClick={useCurrentLocation}>
              현재 위치로 찾기
            </ClayButton>
          )}
          {editing && location && (
            <ClayButton variant="ghost" size="sm" onClick={() => setEditing(false)}>
              취소
            </ClayButton>
          )}
        </div>
      </div>
    );
  } else if (locating) {
    content = (
      <>
        <div className={styles.statusRow} role="status">
          <p>현재 위치를 확인하고 있어요...</p>
          <ClayButton variant="ghost" size="sm" onClick={() => setEditing(true)}>
            직접 입력할게요
          </ClayButton>
        </div>
        <SkeletonGrid />
      </>
    );
  } else if (search.status === 'error') {
    const copy = ERROR_COPY[search.errorCode ?? 'upstream'];
    content = (
      <EmptyState
        tone="error"
        title={copy.title}
        description={copy.description}
        action={<ClayButton onClick={search.retry}>다시 시도</ClayButton>}
      />
    );
  } else if (search.status === 'empty') {
    content = (
      <EmptyState
        title={`근처에 ${menu.name} 파는 곳이 없어요`}
        description={`반경 ${formatDistance(search.radius)} 안에서는 찾지 못했어요.`}
        action={
          <>
            {search.canExpandRadius && nextRadius && (
              <ClayButton onClick={search.expandRadius}>반경 {formatDistance(nextRadius)}로 넓히기</ClayButton>
            )}
            <ClayButton variant="secondary" onClick={() => navigate('/')}>
              메뉴 다시 고르기
            </ClayButton>
          </>
        }
      />
    );
  } else if (isLoading) {
    content = (
      <>
        <p className="sr-only" role="status">
          식당을 찾고 있어요
        </p>
        <SkeletonGrid />
      </>
    );
  } else {
    content = (
      <>
        <ul className={styles.grid} aria-live="polite">
          {search.restaurants.map((restaurant, i) => (
            <motion.li
              key={restaurant.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : i * 0.06, duration: 0.25 }}
            >
              <RestaurantCard restaurant={restaurant} />
            </motion.li>
          ))}
        </ul>
        {!search.hasMore && (
          <p className={styles.notice} role="status">
            근처 식당을 다 보여드렸어요!
          </p>
        )}
      </>
    );
  }

  const canReroll = !showInput && !locating && search.status === 'success' && search.hasMore;

  return (
    <PageLayout
      showBack
      bottomBar={
        <>
          <ClayButton
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canReroll}
            loading={location !== undefined && !showInput && search.status === 'loading'}
            onClick={search.reroll}
          >
            식당 다시 추천받기
          </ClayButton>
          <ClayButton variant="secondary" fullWidth onClick={() => navigate('/')}>
            메뉴 다시 고르기
          </ClayButton>
        </>
      }
    >
      <div className={styles.page}>
        <div className={styles.menu}>
          <MenuCard menu={menu} />
        </div>

        <section className={styles.restaurants} aria-labelledby="restaurants-title">
          <div className={styles.sectionHead}>
            <h2 id="restaurants-title" className={styles.sectionTitle}>
              내 주변 {menu.name} 맛집
            </h2>
            {location && !showInput && (
              <div className={styles.locationRow}>
                <p className={styles.locationText}>
                  <strong>{location.label}</strong> 기준 · 반경 {formatDistance(search.radius)}
                </p>
                <ClayButton variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  위치 바꾸기
                </ClayButton>
              </div>
            )}
          </div>

          {content}

          {search.isMock && !showInput && (
            <p className={styles.mockNote}>카카오 API 키가 아직 없어서 예시 식당을 보여드리고 있어요.</p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
