// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: window.env?.VITE_API_KEY || import.meta.env.VITE_API_KEY,
  authDomain: window.env?.VITE_AUTH_DOMAIN || import.meta.env.VITE_AUTH_DOMAIN,
  projectId: window.env?.VITE_PROJECT_ID || import.meta.env.VITE_PROJECT_ID,
  storageBucket:
    window.env?.VITE_STORAGE_BUCKET || import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId:
    window.env?.VITE_MESSAGING_SENDER_ID ||
    import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: window.env?.VITE_APP_ID || import.meta.env.VITE_APP_ID,
  measurementId:
    window.env?.VITE_MEASUREMENT_ID || import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in production and if measurementId exists
const analytics = firebaseConfig.measurementId ? getAnalytics(app) : null;
const db = getFirestore(app);

export { db, analytics };
