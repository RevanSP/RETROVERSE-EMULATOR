import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HOME from './pages/HOME';
import GamePage from './pages/GamePage';
import CustomROM from './pages/CustomROM';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HOME />} />
        <Route path="/atari2600/game/:gameId" element={<GamePage />} />
        <Route path="/atari5200/game/:gameId" element={<GamePage />} />
        <Route path="/atari7800/game/:gameId" element={<GamePage />} />
        <Route path="/atarijaguar/game/:gameId" element={<GamePage />} />
        <Route path="/atarilynx/game/:gameId" element={<GamePage />} />
        <Route path="/gameboy/game/:gameId" element={<GamePage />} />
        <Route path="/gba/game/:gameId" element={<GamePage />} />
        <Route path="/n64/game/:gameId" element={<GamePage />} />
        <Route path="/nds/game/:gameId" element={<GamePage />} />
        <Route path="/nes/game/:gameId" element={<GamePage />} />
        <Route path="/segamd/game/:gameId" element={<GamePage />} />
        <Route path="/segams/game/:gameId" element={<GamePage />} />
        <Route path="/snes/game/:gameId" element={<GamePage />} />
        <Route path="/virtualboy/game/:gameId" element={<GamePage />} />
        <Route path="/customrom" element={<CustomROM />} />
      </Routes>
    </Router>
  );
}

export default App;
