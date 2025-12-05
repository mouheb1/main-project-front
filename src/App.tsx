import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Game } from '@/components/game/Game';
import { LandingPage } from '@/pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
