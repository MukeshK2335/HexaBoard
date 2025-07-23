// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBlrQOpX-BWgJ6fb5zQks9MfmTke1Ls3ys",
    authDomain: "hexaboard-a9ea8.firebaseapp.com",
    projectId: "hexaboard-a9ea8",
    storageBucket: "hexaboard-a9ea8.appspot.com",
    messagingSenderId: "86808097323",
    appId: "1:86808097323:web:6f17bdc779424f9c0b706e"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
