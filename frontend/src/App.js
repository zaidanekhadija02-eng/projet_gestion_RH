import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CandidatDashboard from './pages/CandidatDashboard';
import EmployeDashboard from './pages/EmployeDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Dashboards selon rôles */}
        <Route path="/candidat-dashboard" element={<CandidatDashboard />} />
        <Route path="/employe-dashboard" element={<EmployeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Rediriger toutes les autres routes vers login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
