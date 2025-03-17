// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Importa la autenticación
import { getFirestore } from "firebase/firestore"; // Importa Firestore
import { getStorage } from "firebase/storage"; // <-- AGREGA ESTO

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJIE7gxdQLLt6IrcqmlAt4ZXNkumsQLuM",
  authDomain: "metroavila-b1e42.firebaseapp.com",
  projectId: "metroavila-b1e42",
  storageBucket: "metroavila-b1e42.appspot.com", // <-- CORRIGE ESTO (.app → .appspot.com)
  messagingSenderId: "910101319881",
  appId: "1:910101319881:web:92054db0c36b9add003d18",
  measurementId: "G-7J22DQBE85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Inicializa la autenticación
const db = getFirestore(app); // Inicializa Firestore
const storage = getStorage(app); // <-- AGREGA ESTO PARA STORAGE

// Exportamos todo lo necesario
export { app, analytics, auth, db, storage };
