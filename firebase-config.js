import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvV434K3YNCm0h-MkJ4bHCm4phvaWIYrw",
  authDomain: "school-management-system-c88fe.firebaseapp.com",
  projectId: "school-management-system-c88fe",
  storageBucket: "school-management-system-c88fe.firebasestorage.app",
  messagingSenderId: "835304091930",
  appId: "1:835304091930:web:f1f45570c06a86e15cbca3",
  measurementId: "G-QEZZ32QP37"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };