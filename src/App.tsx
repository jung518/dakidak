import { Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Quiz from './pages/Quiz';
import Random from './pages/Random';
import Result from './pages/Result';
import WorldCup from './pages/WorldCup';

/** 라우트 구성 */
export default function App() {
  const location = useLocation();

  return (
    // 페이지를 이동하면 오류 상태를 초기화
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/random" element={<Random />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/worldcup" element={<WorldCup />} />
        <Route path="/result/:menuId" element={<Result />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
