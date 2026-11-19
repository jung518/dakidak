import { Route, Routes } from 'react-router-dom';

/**
 * 라우트 구성
 * 3단계 이후 Home / Random / Quiz / Result / NotFound 페이지로 교체합니다.
 */
function ComingSoon() {
  return (
    <main style={{ padding: 'var(--space-8) var(--layout-gutter)', textAlign: 'center' }}>
      <h1>오늘도 닭이닭</h1>
      <p>오늘 뭐 먹지? 오늘도 닭이지!</p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<ComingSoon />} />
    </Routes>
  );
}
