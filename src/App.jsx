import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSwitcherLogin from './Components/Auth/RoleSwitcherLogin.jsx';
import AdminDashboard from './Components/admin/AdminDashboard.jsx';
import FresherDashboard from './Components/fresher/FresherDashboard.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import LandingPage from './Components/LandingPage.jsx'; // ✅ Import landing page
import ViewFresherDashboard from './Components/fresher/ViewFresherDashboard.jsx';
import './App.css';

function App() {
    return (
        <Router>

            <Routes>

                {/* ✅ Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* ✅ Role Switcher Login */}
                <Route path="/login" element={
                    <div className="outer-box">
                        <div className="inner-wrapper">
                            <RoleSwitcherLogin />
                        </div>
                    </div>
                } />

                {/* ✅ Admin Dashboard - Protected */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* ✅ Fresher Dashboard - Temporarily without protection */}
                <Route path="/fresher" element={<FresherDashboard />} />

                {/* ✅ View Fresher Dashboard - Protected */}
                <Route path="/admin/fresher/:id" element={<ViewFresherDashboard />} />

            </Routes>
        </Router>
    );
}

export default App;
