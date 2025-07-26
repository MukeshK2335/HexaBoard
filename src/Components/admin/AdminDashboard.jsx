// src/Components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import '../../Style/AdminDashboard.css';
import FresherSearch from './FresherSearch';
import Reports from './Reports';
import AgentStatus from './AgentStatus';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    where,
    limit
} from 'firebase/firestore';

import adminpng from '../../assets/admin-logo.png';

const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('dashboard');
    const [loginLogs, setLoginLogs] = useState([]);
    const navigate = useNavigate();

    // Redirect if user is not authenticated or not admin
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/');
            } else {
                const token = await user.getIdTokenResult();
                if (token.claims.role !== 'admin') {
                    navigate('/');
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch last 5 login logs in real-time
    useEffect(() => {
        const q = query(
            collection(db, 'loginLogs'),
            orderBy('timestamp', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                time: doc.data().timestamp?.toDate()?.toLocaleString() || 'N/A',
            }));
            setLoginLogs(logs);
        });

        return () => unsubscribe();
    }, []);

    // Download admin login logs
    const downloadCSV = async () => {
        try {
            const q = query(
                collection(db, 'loginLogs'),
                where('role', '==', 'admin'),
                orderBy('timestamp', 'desc')
            );
            const snapshot = await getDocs(q);

            const logs = snapshot.docs.map(doc => {
                const data = doc.data();
                const time = data.timestamp?.toDate()?.toLocaleString() || 'N/A';
                return `${data.uid || ''},${data.ip || ''},${time}`;
            });

            const csvHeader = 'UID,IP Address,Login Time\n';
            const csvContent = csvHeader + logs.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'admin_login_logs.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('❌ Failed to download admin logs:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderSection = () => {
        switch (selectedTab) {
            case 'fresher':
                return <FresherSearch />;
            case 'reports':
                return <Reports />;
            case 'agent':
                return <AgentStatus />;
            case 'settings':
                return (
                    <section className="admin-settings">
                        <div className="settings-card">
                            <h3>Admin Settings</h3>

                            <div className="login-logs">
                                <h4>Updated few minutes ago..</h4>
                                <table className="log-table">
                                    <thead>
                                    <tr>
                                        <th>IP Address</th>
                                        <th>Login Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loginLogs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.ip}</td>
                                            <td>{log.time}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="button-group">
                                <button className="csv-button" onClick={downloadCSV}>
                                    ⬇️ Download Logs
                                </button>
                                <button className="logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </section>
                );
            case 'dashboard':
            default:
                return (
                    <>
                        <header className="top-bar">
                            <div></div>
                            <div className="admin-info">
                                <span>Admin User</span>
                                <img src={adminpng} alt="avatar" />
                            </div>
                        </header>
                        <section className="dashboard-metrics">
                            <div className="card blue">FRESHERS JOINED <span>0</span></div>
                            <div className="card green">COURSES UPLOADED <span>0</span></div>
                            <div className="card orange">SUBMISSIONS <span>876</span></div>
                            <div className="card teal">ACTIVE USERS <span>0</span></div>
                        </section>
                    </>
                );
        }
    };

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <h2 className="sidebar-title">Admin Portal</h2>
                <nav>
                    <ul>
                        <li className={selectedTab === 'dashboard' ? 'active' : ''} onClick={() => setSelectedTab('dashboard')}>Dashboard</li>
                        <li className={selectedTab === 'fresher' ? 'active' : ''} onClick={() => setSelectedTab('fresher')}>Fresher Search</li>
                        <li className={selectedTab === 'reports' ? 'active' : ''} onClick={() => setSelectedTab('reports')}>Reports</li>
                        <li className={selectedTab === 'agent' ? 'active' : ''} onClick={() => setSelectedTab('agent')}>Agent Status</li>
                        <li className={selectedTab === 'settings' ? 'active' : ''} onClick={() => setSelectedTab('settings')}>Settings</li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                {renderSection()}
            </main>
        </div>
    );
};

export default AdminDashboard;
