import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFDkrCHehARecYsh9WYYdZQ9eEgBfS5yk",
  authDomain: "fleap-cs110-2025.firebaseapp.com",
  projectId: "fleap-cs110-2025",
  storageBucket: "fleap-cs110-2025.firebasestorage.app",
  messagingSenderId: "683126827047",
  appId: "1:683126827047:web:63400aaa762413dbb50602",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
