import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts';
import '../../Style/FresherProfile.css';

const FresherProfile = () => {
    const { email } = useParams();
    const [fresher, setFresher] = useState(null);
    const [activeCourse, setActiveCourse] = useState('');

    useEffect(() => {
        const fetchFresher = async () => {
            const snapshot = await getDocs(collection(db, 'users'));
            const matched = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .find(user => user.email === decodeURIComponent(email));
            setFresher(matched || null);
        };

        const fetchActiveCourse = async () => {
            const q = query(collection(db, 'activeCourses'), where('userEmail', '==', decodeURIComponent(email)));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setActiveCourse(data.courseName || '');
            }
        };

        fetchFresher();
        fetchActiveCourse();
    }, [email]);

    if (!fresher) return <div>Loading or fresher not found...</div>;

    const progressData = [
        { name: 'Quiz', value: fresher.quizStatus === 'Completed' ? 100 : 50 },
        { name: 'Challenge', value: fresher.challengeProgress === 'Completed' ? 100 : 30 },
        { name: 'Assignment', value: fresher.assignmentStatus === 'Submitted' ? 100 : 40 },
        { name: 'Certification', value: fresher.certificationStatus === 'Completed' ? 100 : 20 },
    ];

    const loginActivity = [
        { date: 'Jul 1', count: 1 },
        { date: 'Jul 2', count: 0 },
        { date: 'Jul 3', count: 2 },
        { date: 'Jul 4', count: 1 },
        { date: 'Jul 5', count: 3 },
        { date: 'Jul 6', count: 0 },
        { date: 'Jul 7', count: 2 },
    ];

    return (
        <div className="fresher-profile-container">
            <h2>{fresher.name}'s Profile</h2>
            <p><strong>Email:</strong> {fresher.email}</p>
            <p><strong>Department:</strong> {fresher.department}</p>
            <p><strong>Skill:</strong> {fresher.skill}</p>
            <p><strong>Active Course:</strong> {activeCourse || 'Java Bootcamp'}</p>

            <div className="assignment-summary">
                <p><strong>Pending Assignments:</strong> {fresher.assignmentStatus === 'Pending' ? 1 : 0}</p>
                <p><strong>Completed Assignments:</strong> {fresher.assignmentStatus === 'Submitted' ? 1 : 0}</p>
            </div>

            <div className="charts-section">
                <h3>Training Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={progressData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                <h3>Login Activity</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={loginActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FresherProfile;
