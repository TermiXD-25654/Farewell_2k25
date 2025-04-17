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
        <Route path="H9KTeKq7RL3WxvCPVLzDhKD5PA" element={<WelcomePage />} />
        <Route path="H7thj7AUcYdeqaBFXDvQrpCo" element={<Round1Page />} />
        <Route path="gODJDqEjHnzPR0LA8WJXLbrE" element={<Round2Page />} />
        <Route path="EEsVIGd64nP0_hl6dmgsTXqe7" element={<Round3Page />} />
        <Route path="UpS6M2lnZl8_uhVnsBFUxBxCCorh" element={<Round4Page />} />
        <Route path="tTUCCgbMheaNlGNahZGKn4" element={<Round5Page />} />
        <Route path="57qWlGe6_jIQ4AW7zji1Je26" element={<Round6Page />} />
      </Routes>
    </Router>
  );
}

export default App;