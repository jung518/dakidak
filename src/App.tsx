import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Quiz from './pages/Quiz';
import Random from './pages/Random';
import Result from './pages/Result';

/** 라우트 구성 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/random" element={<Random />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/result/:menuId" element={<Result />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
