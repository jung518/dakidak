import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Random from './pages/Random';

/**
 * 라우트 구성
 * - /quiz, /result/:menuId 는 6~7단계에서 추가합니다.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/random" element={<Random />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
