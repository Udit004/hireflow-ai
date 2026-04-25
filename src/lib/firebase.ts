import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5YMe_VLEwkT_2wtB4JKLrKUu9azT__x0",
  authDomain: "hireflow-ai-eda2e.firebaseapp.com",
  projectId: "hireflow-ai-eda2e",
  storageBucket: "hireflow-ai-eda2e.firebasestorage.app",
  messagingSenderId: "10711284286",
  appId: "1:10711284286:web:e99219cf20b85dc9daef6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
