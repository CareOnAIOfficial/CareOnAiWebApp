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
  apiKey: "AIzaSyDuMJRaDBOL7ythKB2eHWw0JifTwfTFqHc",
  authDomain: "ai-careon-first-version.firebaseapp.com",
  databaseURL: "https://ai-careon-first-version-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ai-careon-first-version",
  storageBucket: "ai-careon-first-version.firebasestorage.app",
  messagingSenderId: "67700428108",
  appId: "1:67700428108:web:53afa8c853d8a53a24d3e9"
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
