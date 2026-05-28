import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Your Firebase config — replace with your actual values
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "x3lHqIesS5ZW5yDrTY4M9J5TLgocIOfhIri0rlyi",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "ai-careon-default-rtdb.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://ai-careon-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-careon",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-careon.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
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
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
