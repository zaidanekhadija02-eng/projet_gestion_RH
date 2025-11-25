import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import VerifyOTP from './components/Auth/VerifyOTP';

// Dashboards
import CandidatDashboard from './pages/CandidatDashboard';
import EmployeDashboard from './pages/EmployeDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Dashboards */}
        <Route path="/candidat-dashboard" element={<CandidatDashboard />} />
        <Route path="/employe-dashboard" element={<EmployeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
