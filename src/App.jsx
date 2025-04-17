import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Round1Page from './pages/Round1Page';
import Round2Page from './pages/Round2Page';
import Round3Page from './pages/Round3Page';
import Round4Page from './pages/Round4Page';
import Round5Page from './pages/Round5Page';
import Round6Page from './pages/Round6Page';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />

        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/round1" element={<Round1Page />} />
        <Route path="/round2" element={<Round2Page />} />
        <Route path="/round3" element={<Round3Page />} />
        <Route path="/round4" element={<Round4Page />} />
        <Route path="/round5" element={<Round5Page />} />
        <Route path="/round6" element={<Round6Page />} />
      </Routes>
    </Router>
  );
}

export default App;