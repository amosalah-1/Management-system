import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleToSignup = document.getElementById('show-signup');
const toggleToLogin = document.getElementById('show-login');
const schoolInput = document.getElementById('signup-school');
const classSelect = document.getElementById('signup-class');
const roleCards = document.querySelectorAll('.role-input');

// Toggle Views
toggleToSignup.onclick = () => { loginForm.classList.add('hidden'); signupForm.classList.remove('hidden'); };
toggleToLogin.onclick = () => { signupForm.classList.add('hidden'); loginForm.classList.remove('hidden'); };

// Update form fields based on role selection
roleCards.forEach(card => {
    card.addEventListener('change', (e) => {
        const role = e.target.value;
        
        // Admin needs school field, teachers need class field
        if (role === 'admin') {
            schoolInput.style.display = 'block';
            schoolInput.required = true;
            classSelect.style.display = 'none';
            classSelect.required = false;
        } else if (role === 'teacher') {
            schoolInput.style.display = 'none';
            schoolInput.required = false;
            classSelect.style.display = 'block';
            classSelect.required = true;
        } else {
            schoolInput.style.display = 'none';
            schoolInput.required = false;
            classSelect.style.display = 'none';
            classSelect.required = false;
        }

        // Highlight selected card
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        e.target.closest('.role-card').classList.add('selected');
    });
});

// Sign Up
signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.querySelector('input[name="signup-role"]:checked')?.value;
    const school = document.getElementById('signup-school').value;
    const classRoom = document.getElementById('signup-class').value;

    if (!role) {
        alert("Please select a role");
        return;
    }

    if (role === 'teacher' && !classRoom) {
        alert("Please select a class");
        return;
    }

    try {
        if (role === 'admin') {
            if (!school) {
                alert("Please enter school name");
                return;
            }

            // Check if an admin already exists in the system
            const q = query(collection(db, "users"), where("role", "==", "admin"));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                alert("An administrator account already exists. Only one administrator is allowed per school system.");
                return;
            }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Create user document in Firestore with role
        await setDoc(doc(db, "users", user.uid), {
            fullName: name,
            email: email,
            role: role,
            school: school || null,
            classRoom: classRoom || null,
            createdAt: new Date().toISOString(),
            isActive: true
        });

        alert("Registration successful! Please log in with your new account.");
        window.location.href = 'login.html';
    } catch (error) {
        if (error.code === 'auth/configuration-not-found') {
            alert("Authentication configuration is missing. Please enable 'Email/Password' in the Firebase Console.");
        } else {
            alert("Sign up failed: " + error.message);
        }
    }
};

// Login
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user role and redirect accordingly
        const userDoc = await (await import('./db.js')).getUserData(user.uid);
        
        if (!userDoc) {
            alert("User profile not found. Please contact administrator.");
            return;
        }
        
        if (userDoc.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (userDoc.role === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else {
            alert("Unknown user role. Please contact administrator.");
            return;
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
    }
};