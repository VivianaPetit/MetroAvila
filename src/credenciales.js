import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJIE7gxdQLLt6IrcqmlAt4ZXNkumsQLuM",
  authDomain: "metroavila-b1e42.firebaseapp.com",
  projectId: "metroavila-b1e42",
  storageBucket: "metroavila-b1e42.appspot.com", // <- CORRECTO
  messagingSenderId: "910101319881",
  appId: "1:910101319881:web:92054db0c36b9add003d18",
  measurementId: "G-7J22DQBE85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <-- agregado correctamente

export { app, analytics, auth, db, storage };
