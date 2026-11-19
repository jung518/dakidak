/**
 * 공통 컴포넌트 미리보기 (개발 전용)
 * npm run dev 실행 후 http://localhost:5173/preview.html 에서 확인
 */
import { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  ClayButton,
  ClayCard,
  ClayChip,
  EmptyState,
  LocationInput,
  Logo,
  Mascot,
  MenuCard,
  OptionCard,
  PageLayout,
  ProgressBar,
  RestaurantCard,
  SkeletonCard,
} from '../components/common';
import type { ChickenMenu, Restaurant } from '../types';
import '../styles/global.css';
import styles from './preview.module.css';

const sampleMenu: ChickenMenu = {
  id: 'dakgalbi',
  name: '닭갈비',
  description: '매콤달콤한 양념에 철판으로 볶아낸 춘천의 맛',
  emoji: '🍗',
  cuisine: 'korean',
  cooking: ['stirfry'],
  taste: ['spicy', 'sweet'],
  portion: 'hearty',
  searchKeyword: '닭갈비',
};

const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '닭이닭 춘천닭갈비 본점',
    category: '음식점 > 한식 > 닭요리 > 닭갈비',
    address: '서울 강남구 테헤란로 123',
    distance: 230,
    phone: '02-123-4567',
    placeUrl: 'https://place.map.kakao.com/',
    x: 127.0276,
    y: 37.4979,
  },
  {
    id: '2',
    name: '철판닭갈비 아주 긴 이름의 식당 역삼점',
    category: '음식점 > 한식 > 닭요리',
    address: '서울 강남구 역삼로 45 2층',
    distance: 1480,
    placeUrl: 'https://place.map.kakao.com/',
    x: 127.0336,
    y: 37.4999,
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Preview() {
  const [step, setStep] = useState(2);
  const [chip, setChip] = useState('한식');
  const [selected, setSelected] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <PageLayout
      showBack
      bottomBar={
        <>
          <ClayButton fullWidth icon="📍">
            이 메뉴 파는 식당 찾기
          </ClayButton>
          <ClayButton fullWidth variant="secondary" icon="🔄">
            다시 추천하기
          </ClayButton>
        </>
      }
    >
      <h1 className={styles.pageTitle}>공통 컴포넌트 미리보기</h1>

      <Section title="Logo / Mascot">
        <div className={styles.row}>
          <Logo size="sm" />
          <Logo size="md" />
          <Logo size="lg" />
          <Mascot size="md" />
          <Mascot size="sm" animated={false} />
        </div>
      </Section>

      <Section title="ClayButton">
        <div className={styles.row}>
          <ClayButton size="sm">primary sm</ClayButton>
          <ClayButton>primary md</ClayButton>
          <ClayButton size="lg" icon="🎲">
            primary lg
          </ClayButton>
        </div>
        <div className={styles.row}>
          <ClayButton variant="secondary" icon="🔄">
            secondary
          </ClayButton>
          <ClayButton variant="ghost" icon="🏠">
            ghost
          </ClayButton>
          <ClayButton disabled>disabled</ClayButton>
          <ClayButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          >
            눌러서 loading
          </ClayButton>
          <ClayButton href="https://map.kakao.com" variant="secondary" size="sm">
            링크 버튼
          </ClayButton>
        </div>
        <ClayButton fullWidth icon="📍">
          fullWidth
        </ClayButton>
      </Section>

      <Section title="ClayCard">
        <div className={styles.grid}>
          <ClayCard color="yellow">yellow 카드</ClayCard>
          <ClayCard color="orange">orange 카드</ClayCard>
          <ClayCard color="white" interactive>
            white + interactive (마우스를 올려 보세요)
          </ClayCard>
        </div>
      </Section>

      <Section title="ClayChip">
        <div className={styles.row}>
          <ClayChip label="#한식" />
          <ClayChip label="#볶음" />
          <ClayChip label="#매콤" />
        </div>
        <div className={styles.row}>
          {['한식', '양식', '일식', '중식', '상관없음'].map((label) => (
            <ClayChip key={label} label={label} size="md" selected={chip === label} onClick={() => setChip(label)} />
          ))}
        </div>
      </Section>

      <Section title="OptionCard">
        <div className={styles.grid2}>
          <OptionCard size="lg" color="yellow" icon="🎲" title="랜덤으로 골라줘" description="고민은 그만, 닭이닭이 골라줄게요" onClick={() => {}} />
          <OptionCard size="lg" icon="🧭" title="골라서 찾을래" description="4가지 질문으로 딱 맞는 닭요리 찾기" onClick={() => {}} />
        </div>
        <div className={styles.stack}>
          {['국물', '볶음', '튀김'].map((label) => (
            <OptionCard key={label} title={label} selected={selected === label} onClick={() => setSelected(label)} />
          ))}
        </div>
      </Section>

      <Section title="ProgressBar">
        <ProgressBar current={step} total={4} />
        <div className={styles.row}>
          <ClayButton size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>
            이전
          </ClayButton>
          <ClayButton size="sm" onClick={() => setStep((s) => Math.min(4, s + 1))}>
            다음
          </ClayButton>
        </div>
      </Section>

      <Section title="MenuCard">
        <div className={styles.grid2}>
          <MenuCard menu={sampleMenu} />
          <MenuCard menu={{ ...sampleMenu, id: 'x', name: '치킨난반', emoji: '🍱' }} message="딱 맞는 건 없지만 이건 어때요?" />
        </div>
      </Section>

      <Section title="RestaurantCard / SkeletonCard">
        <div className={styles.grid}>
          {sampleRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
          <SkeletonCard />
        </div>
      </Section>

      <Section title="EmptyState">
        <div className={styles.grid2}>
          <EmptyState
            icon="😢"
            title="근처에 닭갈비 파는 곳이 없어요"
            description="반경을 넓히거나 다른 메뉴를 골라 보세요."
            action={
              <>
                <ClayButton>반경 넓히기</ClayButton>
                <ClayButton variant="secondary">메뉴 다시 고르기</ClayButton>
              </>
            }
          />
          <EmptyState tone="error" icon="🐔" title="앗, 잠시 문제가 생겼어요" description="네트워크 상태를 확인하고 다시 시도해 주세요." action={<ClayButton>다시 시도</ClayButton>} />
        </div>
      </Section>

      <Section title="LocationInput">
        <LocationInput onSubmit={(q) => alert(`입력: ${q}`)} />
      </Section>
    </PageLayout>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <Preview />
      </BrowserRouter>
    </StrictMode>,
  );
}
