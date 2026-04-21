import { auth, db } from './firebase-config.js';
import { 
    doc, setDoc, collection, query, where, getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, getAuth 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Firebase configuration for secondary auth instance (needed to create users without logging out admin)
const firebaseConfig = {
  apiKey: "AIzaSyAvV434K3YNCm0h-MkJ4bHCm4phvaWIYrw",
  authDomain: "school-management-system-c88fe.firebaseapp.com",
  projectId: "school-management-system-c88fe",
  storageBucket: "school-management-system-c88fe.firebasestorage.app",
  messagingSenderId: "835304091930",
  appId: "1:835304091930:web:f1f45570c06a86e15cbca3",
  measurementId: "G-QEZZ32QP37"
};

// UI Navigation Logic
const navLinks = document.querySelectorAll('.nav-link[data-section]');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const sectionId = link.getAttribute('data-section');
        
        // Switch active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Switch active section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    });
});

// Modal Management (Attached to window for HTML onclick attributes)
window.openTeacherModal = () => document.getElementById('teacher-modal').classList.add('active');
window.closeTeacherModal = () => {
    document.getElementById('teacher-modal').classList.remove('active');
    document.getElementById('teacher-form').reset();
};
window.openClassModal = () => document.getElementById('class-modal').classList.add('active');
window.closeClassModal = () => document.getElementById('class-modal').classList.remove('active');
window.closeStudentModal = () => document.getElementById('student-modal').classList.remove('active');

// Initialize Admin Info
onAuthStateChanged(auth, (user) => {
    if (user && document.getElementById('admin-name')) {
        document.getElementById('admin-name').textContent = user.displayName || user.email;
    }
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = 'login.html');
});

// Teacher Form Submission
const teacherForm = document.getElementById('teacher-form');
teacherForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('teacher-name').value;
    const email = document.getElementById('teacher-email').value;
    const action = document.getElementById('teacher-action').value;
    const password = document.getElementById('teacher-password').value;

    if (action === 'create') {
        if (!password || password.length < 6) {
            alert("Please provide a password (min 6 characters) for the new account.");
            return;
        }

        try {
            // Use a secondary Firebase app to create the teacher account without logging out the current admin
            let secondaryApp = getApps().find(app => app.name === 'SecondaryAdmin');
            if (!secondaryApp) {
                secondaryApp = initializeApp(firebaseConfig, 'SecondaryAdmin');
            }
            const secondaryAuth = getAuth(secondaryApp);
            
            // Create Auth User
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, { displayName: name });

            // Create Firestore Profile
            await setDoc(doc(db, "users", user.uid), {
                fullName: name,
                email: email,
                role: 'teacher',
                createdAt: new Date().toISOString(),
                isActive: true
            });

            // Sign out the secondary instance immediately
            await secondaryAuth.signOut();

            alert(`Account successfully created for Teacher: ${name}`);
            closeTeacherModal();
            
            // Note: In a production app, you would refresh the teachers table here.
        } catch (error) {
            console.error("Teacher creation error:", error);
            alert("Failed to create teacher account: " + error.message);
        }
    } else {
        alert("Assigning existing users is currently in development.");
    }
};

// Toggle password field visibility based on action
document.getElementById('teacher-action').addEventListener('change', (e) => {
    const passwordInput = document.getElementById('teacher-password');
    const passwordGroup = passwordInput.parentElement;
    passwordGroup.style.display = e.target.value === 'create' ? 'block' : 'none';
});