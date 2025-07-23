import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSwitcherLogin from './Components/RoleSwitcherLogin.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import FresherDashboard from './Components/FresherDashboard.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="outer-box">
                            <div className="inner-wrapper">
                                <RoleSwitcherLogin />
                            </div>
                        </div>
                    }
                />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/fresher" element={<FresherDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
