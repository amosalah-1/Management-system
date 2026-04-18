import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleToSignup = document.getElementById('show-signup');
const toggleToLogin = document.getElementById('show-login');

// Toggle Views
toggleToSignup.onclick = () => { loginForm.classList.add('hidden'); signupForm.classList.remove('hidden'); };
toggleToLogin.onclick = () => { signupForm.classList.add('hidden'); loginForm.classList.remove('hidden'); };

// Sign Up (Add Student)
signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const school = document.getElementById('signup-school').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: name,
            school: school,
            email: email,
            createdAt: new Date().toISOString()
        });

        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
};

// Login
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';
    } catch (error) {
        alert("Login failed: " + error.message);
    }
};