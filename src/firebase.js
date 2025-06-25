
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCWn2jBwYL1IiUspEBApg-OlIiId5EUWEk",
  authDomain: "rag-chatbot-bb847.firebaseapp.com",
  projectId: "rag-chatbot-bb847",
  storageBucket: "rag-chatbot-bb847.firebasestorage.app",
  messagingSenderId: "44277370456",
  appId: "1:44277370456:web:1524175e35c2087e51442d",
  measurementId: "G-518QXJBED5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();