import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../Style/ViewFresherDashboard.css';
import { Home, User, FileText } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import FresherProfile from '../fresher/FresherProfile.jsx';

const ViewFresherDashboard = () => {
    const { email } = useParams();
    const [fresher, setFresher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const fetchFresher = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'users'),
                    where('email', '==', decodeURIComponent(email))
                );
                const snapshot = await getDocs(q);
                const matched = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                }))[0];

                setFresher(matched || null);
            } catch (error) {
                console.error('Error fetching fresher:', error);
                setFresher(null);
            } finally {
                setLoading(false);
            }
        };

        fetchFresher();
    }, [email]);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">HexaBoard</div>
                <ul className="sidebar-menu">
                    <li>
                        <button
                            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <Home size={18} />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} />
                            Profile
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-link" disabled>
                            <FileText size={18} />
                            Reports
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {loading ? (
                    <p>Loading...</p>
                ) : !fresher ? (
                    <h2>Fresher not found</h2>
                ) : activeTab === 'profile' ? (
                    <FresherProfile fresher={fresher} />
                ) : (
                    // Dashboard content here
                    <div className="fresher-dashboard">
                        <div className="fresher-profile-card">
                            <h2>{fresher.name}'s Dashboard</h2>
                            <p><strong>Email:</strong> {fresher.email}</p>
                            <p><strong>Department:</strong> {fresher.department || 'N/A'}</p>
                            <p><strong>Skill:</strong> {fresher.skill || 'N/A'}</p>
                            <p><strong>Status:</strong> {fresher.status || 'N/A'}</p>
                        </div>

                        <div className="training-status-section">
                            <h3>Training Progress</h3>
                            <div className="training-grid">
                                <div className="status-card">
                                    <p>Daily Quiz Status:</p>
                                    <span>{fresher.quizStatus || 'N/A'}</span>
                                </div>
                                <div className="status-card">
                                    <p>Coding Challenge:</p>
                                    <span>{fresher.challengeProgress || 'N/A'}</span>
                                </div>
                                <div className="status-card">
                                    <p>Assignment Submission:</p>
                                    <span>{fresher.assignmentStatus || 'N/A'}</span>
                                </div>
                                <div className="status-card">
                                    <p>Certification:</p>
                                    <span>{fresher.certificationStatus || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewFresherDashboard;
