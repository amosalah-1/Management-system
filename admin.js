import { auth, db } from './firebase-config.js';
import { 
    doc, setDoc, collection, query, where, getDocs, deleteDoc, updateDoc 
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
window.openStudentModal = () => document.getElementById('student-modal').classList.add('active');

// Data Fetching Logic
async function loadDashboardStats() {
    try {
        const teachersSnap = await getDocs(query(collection(db, "users"), where("role", "==", "teacher")));
        const studentsSnap = await getDocs(collection(db, "students"));
        const classesSnap = await getDocs(collection(db, "classes"));
        const gradesSnap = await getDocs(collection(db, "grades"));

        document.getElementById('stat-teachers').textContent = teachersSnap.size;
        document.getElementById('stat-students').textContent = studentsSnap.size;
        document.getElementById('stat-classes').textContent = classesSnap.size;
        document.getElementById('stat-grades').textContent = gradesSnap.size;
    } catch (e) { console.error("Stats Error:", e); }
}

async function loadUsersTable() {
    const tbody = document.getElementById('users-table');
    if (!tbody) return;
    const snap = await getDocs(collection(db, "users"));
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const data = doc.data();
        tbody.innerHTML += `
            <tr>
                <td>${data.fullName || 'N/A'}</td>
                <td>${data.email}</td>
                <td>${data.role}</td>
                <td>${data.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="window.toggleUserStatus('${doc.id}', ${data.isActive})">Toggle</button>
                </td>
            </tr>
        `;
    });
}

async function loadTeachersTable() {
    const tbody = document.getElementById('teachers-table');
    if (!tbody) return;
    const snap = await getDocs(query(collection(db, "users"), where("role", "==", "teacher")));
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const data = doc.data();
        tbody.innerHTML += `
            <tr>
                <td>${data.fullName}</td>
                <td>${data.email}</td>
                <td>${data.classRoom || 'None'}</td>
                <td>${data.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                    <button class="btn-small btn-delete" onclick="window.deleteRecord('users', '${doc.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function loadClassesTable() {
    const tbody = document.getElementById('classes-table');
    if (!tbody) return;
    const snap = await getDocs(collection(db, "classes"));
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const data = doc.data();
        tbody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>Grade ${data.grade}</td>
                <td>${data.teacherName || 'Unassigned'}</td>
                <td>-</td>
                <td>
                    <button class="btn-small btn-delete" onclick="window.deleteRecord('classes', '${doc.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function loadStudentsTable() {
    const tbody = document.getElementById('students-table');
    if (!tbody) return;
    const snap = await getDocs(collection(db, "students"));
    tbody.innerHTML = '';
    snap.forEach(doc => {
        const data = doc.data();
        tbody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.admissionNumber}</td>
                <td>${data.className || 'N/A'}</td>
                <td>${data.dateOfBirth || 'N/A'}</td>
                <td>
                    <button class="btn-small btn-delete" onclick="window.deleteRecord('students', '${doc.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

window.loadGradesView = async () => {
    const tbody = document.getElementById('grades-table');
    const filter = document.getElementById('grades-class-filter').value;
    if (!tbody) return;
    
    let q = collection(db, "grades");
    if (filter) q = query(q, where("classId", "==", filter));
    
    const snap = await getDocs(q);
    tbody.innerHTML = snap.empty ? '<tr><td colspan="6">No grades found</td></tr>' : '';
    snap.forEach(doc => {
        const data = doc.data();
        tbody.innerHTML += `
            <tr>
                <td>${data.studentName}</td>
                <td>${data.subject}</td>
                <td>${data.score}</td>
                <td>${data.gradeLetter}</td>
                <td>${data.teacherName}</td>
                <td>${data.date}</td>
            </tr>
        `;
    });
};

// Initialize Admin Dashboard
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (document.getElementById('admin-name')) {
            document.getElementById('admin-name').textContent = user.displayName || user.email;
        }
        // Fetch and display all system data
        await loadDashboardStats();
        await loadUsersTable();
        await loadTeachersTable();
        await loadClassesTable();
        await loadStudentsTable();
        await window.loadGradesView();
    } else {
        window.location.href = 'login.html';
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

// Action Handlers
window.toggleUserStatus = async (uid, currentStatus) => {
    await updateDoc(doc(db, "users", uid), { isActive: !currentStatus });
    loadUsersTable();
};

window.deleteRecord = async (col, id) => {
    if (!confirm("Are you sure you want to delete this record? This cannot be undone.")) return;
    await deleteDoc(doc(db, col, id));
    location.reload(); 
};