import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { 
    BookOpen, 
    Award, 
    Clock, 
    Target, 
    TrendingUp, 
    User,
    LogOut,
    Home,
    FileText,
    BarChart3,
    GraduationCap,
    Calendar,
    ClipboardList
} from 'lucide-react';
import '../../Style/FresherDashboard.css';
import FresherLearning from './FresherLearning';

const FresherDashboard = () => {
    const [fresher, setFresher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [coursesData, setCoursesData] = useState([]);
    const [assessmentData, setAssessmentData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/');
                return;
            }

            try {
                // Get user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role !== 'fresher') {
                        navigate('/');
                        return;
                    }
                    setFresher({
                        uid: user.uid,
                        email: user.email,
                        ...userData
                    });
                    
                    // Fetch additional data
                    await fetchUserProgress(user.uid);
                } else {
                    console.error('User document not found');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchUserProgress = async (userId) => {
        try {
            // Fetch user's course progress
            const progressQuery = query(
                collection(db, 'userProgress'),
                where('userId', '==', userId)
            );
            const progressSnapshot = await getDocs(progressQuery);
            const progressData = progressSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Fetch courses
            const coursesSnapshot = await getDocs(collection(db, 'courses'));
            const courses = coursesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Combine course data with progress
            const coursesWithProgress = courses.map(course => {
                const progress = progressData.find(p => p.courseId === course.id);
                return {
                    ...course,
                    progress: progress?.overallProgress || 0,
                    status: progress ? (progress.overallProgress === 100 ? 'Completed' : 'In Progress') : 'Not Started'
                };
            });

            setCoursesData(coursesWithProgress);

            // Fetch assessment results
            const assessmentQuery = query(
                collection(db, 'assessmentResults'),
                where('userId', '==', userId)
            );
            const assessmentSnapshot = await getDocs(assessmentQuery);
            const assessments = assessmentSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAssessmentData(assessments);

        } catch (error) {
            console.error('Error fetching user progress:', error);
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!fresher) {
        return (
            <div className="error-container">
                <h2>Access Denied</h2>
                <p>Unable to load fresher dashboard. Please try logging in again.</p>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    const progressData = [
        { name: 'Courses', completed: coursesData.filter(c => c.status === 'Completed').length, total: coursesData.length },
        { name: 'Assessments', completed: assessmentData.filter(a => a.passed).length, total: assessmentData.length },
        { name: 'Certifications', completed: 0, total: 1 }
    ];

    const weeklyActivity = [
        { week: 'Week 1', hours: 8, logins: 5 },
        { week: 'Week 2', hours: 12, logins: 7 },
        { week: 'Week 3', hours: 10, logins: 6 },
        { week: 'Week 4', hours: 15, logins: 8 }
    ];

    const skillProgress = [
        { skill: 'JavaScript', progress: 75 },
        { skill: 'React', progress: 60 },
        { skill: 'Node.js', progress: 45 },
        { skill: 'Database', progress: 30 }
    ];

    const renderDashboard = () => (
        <div className="dashboard-content">
            <div className="welcome-section">
                <div className="welcome-card">
                    <div className="welcome-text">
                        <h2>Welcome back, {fresher.name || 'Fresher'}!</h2>
                        <p>Continue your learning journey and track your progress</p>
                    </div>
                    <div className="welcome-stats">
                        <div className="stat-item">
                            <span className="stat-number">{coursesData.filter(c => c.status === 'Completed').length}</span>
                            <span className="stat-label">Completed Courses</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{assessmentData.filter(a => a.passed).length}</span>
                            <span className="stat-label">Passed Assessments</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <BookOpen size={24} />
                        <h3>Course Progress</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={progressData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completed" fill="#4F46E5" />
                            <Bar dataKey="total" fill="#E5E7EB" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <TrendingUp size={24} />
                        <h3>Weekly Activity</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="courses-overview">
                <h3>My Courses</h3>
                <div className="courses-list">
                    {coursesData.slice(0, 3).map(course => (
                        <div key={course.id} className="course-item">
                            <div className="course-info">
                                <h4>{course.title}</h4>
                                <p>{course.description}</p>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{course.progress}% Complete</span>
                            </div>
                            <div className="course-status">
                                <span className={`status-badge ${course.status.toLowerCase().replace(' ', '-')}`}>
                                    {course.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="profile-content">
            <div className="profile-header">
                <div className="profile-avatar">
                    <User size={48} />
                </div>
                <div className="profile-info">
                    <h2>{fresher.name || 'Fresher Name'}</h2>
                    <p>{fresher.email}</p>
                    <div className="profile-details">
                        <span><strong>Department:</strong> {fresher.department || 'Not specified'}</span>
                        <span><strong>Skill Focus:</strong> {fresher.skill || 'Not specified'}</span>
                        <span><strong>Start Date:</strong> {fresher.startDate || 'Not specified'}</span>
                        <span><strong>Status:</strong> {fresher.status || 'Active'}</span>
                    </div>
                </div>
            </div>

            <div className="skill-progress-section">
                <h3>Skill Development</h3>
                <div className="skills-grid">
                    {skillProgress.map(skill => (
                        <div key={skill.skill} className="skill-item">
                            <div className="skill-header">
                                <span>{skill.skill}</span>
                                <span>{skill.progress}%</span>
                            </div>
                            <div className="skill-bar">
                                <div 
                                    className="skill-fill"
                                    style={{ width: `${skill.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="reports-content">
            <h2>Progress Reports</h2>
            <div className="reports-grid">
                <div className="report-card">
                    <h3>Assessment Performance</h3>
                    <div className="performance-stats">
                        <div className="stat">
                            <span className="stat-value">{assessmentData.length}</span>
                            <span className="stat-label">Total Assessments</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{assessmentData.filter(a => a.passed).length}</span>
                            <span className="stat-label">Passed</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">
                                {assessmentData.length > 0 
                                    ? Math.round((assessmentData.reduce((sum, a) => sum + a.score, 0) / assessmentData.length))
                                    : 0}%
                            </span>
                            <span className="stat-label">Average Score</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fresher-dashboard">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>HexaBoard</h2>
                </div>
                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <GraduationCap size={20} />
                        Courses
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        <Calendar size={20} />
                        Schedule
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        <ClipboardList size={20} />
                        Assignments
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        Profile
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <BarChart3 size={20} />
                        Reports
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                <div className="topbar">
                    <h1>
                        {activeTab === 'dashboard' && 'Dashboard'}
                        {activeTab === 'profile' && 'My Profile'}
                        {activeTab === 'reports' && 'Progress Reports'}
                    </h1>
                    <div className="user-info">
                        <span>Welcome, {fresher.name || fresher.email}</span>
                    </div>
                </div>

                <div className="content-area">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'courses' && <FresherLearning />}
                    {activeTab === 'schedule' && <div className="coming-soon">Schedule feature coming soon...</div>}
                    {activeTab === 'assignments' && <div className="coming-soon">Assignments feature coming soon...</div>}
                    {activeTab === 'profile' && renderProfile()}
                    {activeTab === 'reports' && renderReports()}
                </div>
            </div>
        </div>
    );
};

export default FresherDashboard;