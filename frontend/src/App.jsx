import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Reminders from './pages/Reminders';
import DietPlan from './pages/DietPlan';
import Wellness from './pages/Wellness';
import Shopping from './pages/Shopping';
import Education from './pages/Education';
import HospitalFinder from './pages/HospitalFinder';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Authenticated Routes wrapped in Sidebar Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/diet" element={<DietPlan />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/education" element={<Education />} />
          <Route path="/hospital-finder" element={<HospitalFinder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
