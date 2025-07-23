import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSwitcherLogin from './Components/RoleSwitcherLogin.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import FresherDashboard from './Components/FresherDashboard.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RoleSwitcherLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/fresher" element={<FresherDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
