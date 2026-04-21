import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getAllTeachers,
    getAllClasses,
    getAllStudents,
    createClass,
    addStudent,
    updateUserRole,
    getUserData,
    getClassesByGrade,
    getStudentsByClass,
    getClassGrades,
    deleteClass,
    deleteStudent
} from './db.js';

// Auth State Management
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userData = await getUserData(user.uid);
        if (userData && userData.role === 'admin') {
            document.getElementById('admin-name').textContent = `Welcome, ${userData.fullName}`;
            loadDashboardData();
        } else {
            window.location.href = 'login.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (e.target.id === 'logout-btn') {
            handleLogout();
            return;
        }
        
        const section = e.target.dataset.section;
        if (section) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            if (section === 'users') loadAllUsers();
            if (section === 'teachers') loadTeachers();
            if (section === 'classes') loadClasses();
            if (section === 'students') loadAllStudentsInSchool();
            if (section === 'students') loadStudents();
            if (section === 'grades') loadGradesView();
        }
    });
});

// ============ DASHBOARD ============
async function loadDashboardData() {
    try {
        const teachers = await getAllTeachers();
        const classes = await getAllClasses();
        const students = await getAllStudents();
        
        document.getElementById('stat-teachers').textContent = teachers.length;
        document.getElementById('stat-students').textContent = students.length;
        document.getElementById('stat-classes').textContent = classes.length;
        
        // Count total grades
        let totalGrades = 0;
        for (const cls of classes) {
            const grades = await getClassGrades(cls.id);
            totalGrades += grades.length;
        }
        document.getElementById('stat-grades').textContent = totalGrades;
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

// ============ MANAGE ALL USERS ============
async function loadAllUsers() {
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const tbody = document.getElementById('users-table');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.fullName || 'N/A'}</td>
                <td>${user.email}</td>
                <td><strong>${user.role || 'N/A'}</strong></td>
                <td>${user.isActive !== false ? '✓ Active' : '✗ Inactive'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="changeUserRole('${user.id}', '${user.fullName}')">Change Role</button>
                    <button class="btn-small ${user.isActive !== false ? 'btn-delete' : 'btn-edit'}" onclick="toggleUserActive('${user.id}', '${user.fullName}', ${user.isActive !== false})">
                        ${user.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Error loading users:", error);
        document.getElementById('users-table').innerHTML = '<tr><td colspan="5">Error loading users</td></tr>';
    }
}

async function changeUserRole(userId, userName) {
    const user = await getUserData(userId);
    if (!user) return;

    const newRole = prompt(
        `Change role for ${userName}?\n\nCurrent: ${user.role}\n\nNew role (admin/teacher/student):`,
        user.role
    );

    if (newRole && ['admin', 'teacher', 'student'].includes(newRole)) {
        try {
            await updateUserRole(userId, newRole);
            alert(`${userName}'s role changed to ${newRole}`);
            loadAllUsers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    } else if (newRole) {
        alert('Invalid role. Please use: admin, teacher, or student');
    }
}

async function toggleUserActive(userId, userName, isCurrentlyActive) {
    const newActiveState = !isCurrentlyActive;
    const action = newActiveState ? 'Activate' : 'Deactivate';
    
    if (confirm(`${action} ${userName}?`)) {
        try {
            const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await updateDoc(doc(db, "users", userId), { isActive: newActiveState });
            alert(`${userName} has been ${action.toLowerCase()}d`);
            loadAllUsers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============ ALL STUDENTS IN SCHOOL ============
async function loadAllStudentsInSchool() {
    try {
        const { collection, getDocs, query } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const students = studentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const tbody = document.getElementById('students-table');
        
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No students in the school yet</td></tr>';
            return;
        }

        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.name || 'N/A'}</td>
                <td>${student.admissionNumber || 'N/A'}</td>
                <td>${student.className || 'N/A'}</td>
                <td>${student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="viewStudentDetails('${student.id}')">View</button>
                    <button class="btn-small btn-delete" onclick="deleteStudentFromSchool('${student.id}', '${student.name}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Error loading students:", error);
        document.getElementById('students-table').innerHTML = '<tr><td colspan="5">Error loading students</td></tr>';
    }
}

async function viewStudentDetails(studentId) {
    try {
        const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const studentDoc = await getDoc(doc(db, "students", studentId));
        if (studentDoc.exists()) {
            const data = studentDoc.data();
            alert(`Student: ${data.name}\nAdmission: ${data.admissionNumber}\nClass: ${data.className}\nDOB: ${data.dateOfBirth || 'N/A'}`);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteStudentFromSchool(studentId, studentName) {
    if (confirm(`Delete ${studentName} from school? This action cannot be undone.`)) {
        try {
            const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(db, "students", studentId));
            alert('Student deleted successfully');
            loadAllStudentsInSchool();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============ TEACHERS MANAGEMENT ============
async function loadTeachers() {
    try {
        const teachers = await getAllTeachers();
        const tbody = document.getElementById('teachers-table');
        
        tbody.innerHTML = teachers.map(teacher => `
            <tr>
                <td>${teacher.fullName}</td>
                <td>${teacher.email}</td>
                <td><span id="classes-${teacher.id}">0</span></td>
                <td>${teacher.isActive ? '✓ Active' : '✗ Inactive'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editTeacher('${teacher.id}')">Edit Role</button>
                    <button class="btn-small ${teacher.isActive ? 'btn-delete' : 'btn-edit'}" onclick="toggleTeacherActive('${teacher.id}', ${!teacher.isActive})">
                        ${teacher.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            </tr>
        `).join('');

        // Count classes per teacher
        for (const teacher of teachers) {
            try {
                const classes = await getClassesByTeacher(teacher.id);
                const classCount = document.getElementById(`classes-${teacher.id}`);
                if (classCount) classCount.textContent = classes.length;
            } catch (e) {
                // Teacher might not have classes
            }
        }
    } catch (error) {
        console.error("Error loading teachers:", error);
        document.getElementById('teachers-table').innerHTML = '<tr><td colspan="5">Error loading teachers</td></tr>';
    }
}

function openTeacherModal() {
    document.getElementById('teacher-modal').classList.add('active');
}

function closeTeacherModal() {
    document.getElementById('teacher-modal').classList.remove('active');
    document.getElementById('teacher-form').reset();
}

document.getElementById('teacher-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Note: In production, you'd use Firebase Admin SDK to create users
    alert('Teacher creation requires backend implementation. You can manually create an account and admin will assign the teacher role.');
    closeTeacherModal();
    loadTeachers();
});

async function editTeacher(teacherId) {
    const teacher = await getUserData(teacherId);
    if (!teacher) return;

    const newRole = prompt(
        `Change role for ${teacher.fullName}?\n\nCurrent: ${teacher.role}\n\nNew role (admin/teacher/student):`,
        teacher.role
    );

    if (newRole && ['admin', 'teacher', 'student'].includes(newRole)) {
        try {
            await updateUserRole(teacherId, newRole);
            alert(`${teacher.fullName}'s role changed to ${newRole}`);
            loadTeachers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    } else if (newRole) {
        alert('Invalid role. Please use: admin, teacher, or student');
    }
}

async function toggleTeacherActive(teacherId, isActive) {
    const teacher = await getUserData(teacherId);
    if (!teacher) return;

    const action = isActive ? 'Activate' : 'Deactivate';
    if (confirm(`${action} ${teacher.fullName}?`)) {
        try {
            const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await updateDoc(doc(db, "users", teacherId), { isActive });
            alert(`${teacher.fullName} has been ${action.toLowerCase()}d`);
            loadTeachers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function deactivateTeacher(teacherId) {
    // This function is deprecated, use toggleTeacherActive instead
    toggleTeacherActive(teacherId, false);
}

// ============ CLASSES MANAGEMENT ============
async function loadClasses() {
    try {
        const classes = await getAllClasses();
        const tbody = document.getElementById('classes-table');
        
        tbody.innerHTML = await Promise.all(classes.map(async (cls) => {
            const students = await getStudentsByClass(cls.id);
            const teacher = await getUserData(cls.teacherId);
            return `
                <tr>
                    <td>${cls.name}</td>
                    <td>Grade ${cls.grade}</td>
                    <td>${teacher ? teacher.fullName : 'Not assigned'}</td>
                    <td>${students.length}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="editClass('${cls.id}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteClassItem('${cls.id}')">Delete</button>
                    </td>
                </tr>
            `;
        })).then(rows => rows.join(''));

        // Populate class dropdown for student modal
        const classSelect = document.getElementById('student-class');
        const gradeFilter = document.getElementById('grades-class-filter');
        classSelect.innerHTML = classes.map(c => `<option value="${c.id}">${c.name} (Grade ${c.grade})</option>`).join('');
        gradeFilter.innerHTML = '<option value="">All Classes</option>' + classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        // Populate teacher select for class modal
        const teachers = await getAllTeachers();
        document.getElementById('class-teacher').innerHTML = teachers.map(t => `<option value="${t.id}">${t.fullName}</option>`).join('');
    } catch (error) {
        console.error("Error loading classes:", error);
    }
}

function openClassModal() {
    document.getElementById('class-modal').classList.add('active');
}

function closeClassModal() {
    document.getElementById('class-modal').classList.remove('active');
    document.getElementById('class-form').reset();
}

document.getElementById('class-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await createClass({
            name: document.getElementById('class-name').value,
            grade: document.getElementById('class-grade').value,
            teacherId: document.getElementById('class-teacher').value
        });
        closeClassModal();
        loadClasses();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

async function editClass(classId) {
    alert('Edit class functionality to be implemented');
}

async function deleteClassItem(classId) {
    if (confirm('Delete this class? This action cannot be undone.')) {
        try {
            await deleteClass(classId);
            loadClasses();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============ STUDENTS MANAGEMENT ============
async function loadStudents() {
    try {
        const students = await getAllStudents();
        const tbody = document.getElementById('students-table');
        
        tbody.innerHTML = await Promise.all(students.map(async (student) => {
            const cls = await (async () => {
                const classes = await getAllClasses();
                return classes.find(c => c.id === student.classId);
            })();
            
            return `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.admissionNumber}</td>
                    <td>${cls ? cls.name : 'Not assigned'}</td>
                    <td>Grade ${cls ? cls.grade : 'N/A'}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="editStudent('${student.id}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteStudentItem('${student.id}')">Delete</button>
                    </td>
                </tr>
            `;
        })).then(rows => rows.join(''));
    } catch (error) {
        console.error("Error loading students:", error);
    }
}

function openStudentModal() {
    document.getElementById('student-modal').classList.add('active');
}

function closeStudentModal() {
    document.getElementById('student-modal').classList.remove('active');
    document.getElementById('student-form').reset();
}

document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await addStudent({
            name: document.getElementById('student-name').value,
            admissionNumber: document.getElementById('student-admission').value,
            classId: document.getElementById('student-class').value,
            dateOfBirth: document.getElementById('student-dob').value
        });
        closeStudentModal();
        loadStudents();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

async function editStudent(studentId) {
    alert('Edit student functionality to be implemented');
}

async function deleteStudentItem(studentId) {
    if (confirm('Delete this student?')) {
        try {
            await deleteStudent(studentId);
            loadStudents();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============ GRADES VIEW ============
async function loadGradesView() {
    try {
        const classId = document.getElementById('grades-class-filter').value;
        const grades = classId ? await getClassGrades(classId) : [];
        const tbody = document.getElementById('grades-table');
        
        if (!classId) {
            tbody.innerHTML = '<tr><td colspan="6">Select a class to view grades</td></tr>';
            return;
        }

        tbody.innerHTML = grades.map(grade => `
            <tr>
                <td>${grade.studentName || 'Unknown'}</td>
                <td>${grade.subject}</td>
                <td>${grade.score}</td>
                <td>${grade.gradeLetter}</td>
                <td>${grade.teacherName || 'N/A'}</td>
                <td>${new Date(grade.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('') || '<tr><td colspan="6">No grades recorded</td></tr>';
    } catch (error) {
        console.error("Error loading grades:", error);
    }
}

// Logout
function handleLogout() {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    });
}

// Make functions global for HTML onclick handlers
window.openTeacherModal = openTeacherModal;
window.closeTeacherModal = closeTeacherModal;
window.loadAllUsers = loadAllUsers;
window.changeUserRole = changeUserRole;
window.toggleUserActive = toggleUserActive;
window.loadAllStudentsInSchool = loadAllStudentsInSchool;
window.viewStudentDetails = viewStudentDetails;
window.deleteStudentFromSchool = deleteStudentFromSchool;
window.editTeacher = editTeacher;
window.toggleTeacherActive = toggleTeacherActive;
window.deactivateTeacher = deactivateTeacher;
window.openClassModal = openClassModal;
window.closeClassModal = closeClassModal;
window.editClass = editClass;
window.deleteClassItem = deleteClassItem;
window.openStudentModal = openStudentModal;
window.closeStudentModal = closeStudentModal;
window.editStudent = editStudent;
window.deleteStudentItem = deleteStudentItem;
window.loadGradesView = loadGradesView;
window.handleLogout = handleLogout;
