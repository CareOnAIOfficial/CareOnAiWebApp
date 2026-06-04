import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Vite env values can override these local development defaults.
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCqDoqa_rzy_ZnWaCWoyYl9Yp3Jb1EbO5w",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-careon.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://ai-careon-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-careon",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "ai-careon.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "258872716187",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:258872716187:web:4ff97c31e0ae18be3a0f3e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XGC37KGGRY",
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value.includes("YOUR_"))
  .map(([key]) => key);

if (missingConfig.length > 0) {
  console.warn(
    `Missing Firebase config: ${missingConfig.join(
      ", ",
    )}. Add your Firebase web app values to .env.local.`,
  );
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export {
  app,
  database,
  auth,
  ref,
  onValue,
  set,
  get,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
};
