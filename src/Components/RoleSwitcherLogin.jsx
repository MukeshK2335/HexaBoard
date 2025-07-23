// src/Components/RoleSwitcherLogin.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../Style/RoleSwitcherLogin.css';
import { useNavigate } from 'react-router-dom';

const RoleSwitcherLogin = () => {
    const [role, setRole] = useState('fresher');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(""); // clear previous error
        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userRole = userSnap.data().role;

                if (userRole !== role) {
                    setError("Role mismatch! Switch to the correct tab.");
                    return;
                }

                // Navigate based on role
                if (userRole === 'admin') {
                    navigate('/admin');
                } else if (userRole === 'fresher') {
                    navigate('/fresher');
                } else {
                    setError('Unknown role assigned.');
                }

            } else {
                setError("User role not found in database.");
            }
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError("No user found with this email.");
            } else if (err.code === 'auth/wrong-password') {
                setError("Incorrect password.");
            } else {
                setError("Login failed: " + err.message);
            }
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-heading">HexaBoard Login</h1>
            <div className="tabs">
                <button className={role === 'fresher' ? 'active' : ''} onClick={() => setRole('fresher')}>
                    Fresher
                </button>
                <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>
                    Admin
                </button>
            </div>
            <div className="form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default RoleSwitcherLogin;
