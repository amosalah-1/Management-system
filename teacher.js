import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getClassesByTeacher,
    getStudentsByClass,
    getStudentsByTeacher,
    addStudent,
    updateStudent,
    deleteStudent,
    addGrade,
    getTeacherGrades,
    updateGrade,
    deleteGrade,
    getUserData,
    getStudentGrades
} from './db.js';

let currentTeacher = null;
let currentClass = null;
let editingGradeId = null;
let allGrades = [];

// Auth State Management
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userData = await getUserData(user.uid);
        if (userData && userData.role === 'teacher') {
            currentTeacher = { id: user.uid, ...userData };
            document.getElementById('teacher-name').textContent = `Welcome, ${userData.fullName}`;
            loadTeacherDashboard();
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
        const targetLink = e.currentTarget;
        if (targetLink.id === 'logout-btn') {
            handleLogout();
            return;
        }
        
        const section = targetLink.dataset.section;
        if (section) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');

            if (section === 'students') loadMyStudents();
            if (section === 'grades') loadClassStudentsForGrading();
            if (section === 'records') loadTeacherGrades();
        }
    });
});

// ============ DASHBOARD ============
async function loadTeacherDashboard() {
    try {
        const classes = await getClassesByTeacher(currentTeacher.id);
        const overview = document.getElementById('classes-overview');
        
        let html = '';
        let totalStudents = 0;

        for (const cls of classes) {
            const students = await getStudentsByClass(cls.id);
            const grades = await getClassGrades(cls.id);
            totalStudents += students.length;

            html += `
                <div class="stat-card">
                    <h3>${cls.name}</h3>
                    <div style="color: #555; margin: 10px 0;">Grade ${cls.grade}</div>
                    <div class="value">${students.length}</div>
                    <div style="color: #7f8c8d; font-size: 12px;">Students</div>
                    <div style="color: #7f8c8d; font-size: 12px; margin-top: 10px;">
                        ${grades.length} Grades Added
                    </div>
                </div>
            `;
        }

        overview.innerHTML = html || '<p>You have no assigned classes yet.</p>';

        // Populate class dropdowns
        populateClassDropdowns(classes);
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

function populateClassDropdowns(classes) {
    const classFilter = document.getElementById('class-filter');
    const gradeClassFilter = document.getElementById('grade-class-filter');
    
    const options = classes.map(c => `<option value="${c.id}">${c.name} (Grade ${c.grade})</option>`).join('');
    
    classFilter.innerHTML = '<option value="">Select Class</option>' + options;
    gradeClassFilter.innerHTML = '<option value="">Select Class</option>' + options;
}

// ============ MY STUDENTS MANAGEMENT ============
async function loadMyStudents() {
    const tbody = document.getElementById('students-table');

    try {
        const students = await getStudentsByTeacher(currentTeacher.id, currentTeacher.classRoom);
        
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.admissionNumber}</td>
                <td>${student.dateOfBirth || 'N/A'}</td>
                <td>
                    <button class="btn-small btn-edit-grade" onclick="editStudent('${student.id}')">Edit</button>
                    <button class="btn-small btn-delete-grade" onclick="removeStudent('${student.id}', '${student.name}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4">No students added yet. Start by adding students!</td></tr>';
    } catch (error) {
        console.error("Error loading students:", error);
        tbody.innerHTML = '<tr><td colspan="4">Error loading students</td></tr>';
    }
}

function openAddStudentModal() {
    const modal = document.getElementById('student-modal');
    const form = document.getElementById('student-form');
    const classSelect = document.getElementById('student-class');

    modal.classList.add('active');
    form.reset();

    // Populate classes for this teacher
    getClassesByTeacher(currentTeacher.id).then(classes => {
        if (classSelect) {
            classSelect.innerHTML = '<option value="">Select Class</option>' + 
                classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    });
}

function closeAddStudentModal() {
    document.getElementById('student-modal').classList.remove('active');
    document.getElementById('student-form').reset();
}

// Add Student Form Submission
document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('student-name').value;
    const admissionNo = document.getElementById('student-admission').value;
    const classId = document.getElementById('student-class').value;
    const className = document.getElementById('student-class').options[document.getElementById('student-class').selectedIndex].text;
    const dob = document.getElementById('student-dob').value;

    if (!classId) {
        alert("Please select a class for the student.");
        return;
    }

    try {
        await addStudent({
            name: name,
            admissionNumber: admissionNo,
            dateOfBirth: dob,
            classId: classId,
            className: className,
            teacherId: currentTeacher.id,
            createdAt: new Date().toISOString()
        });

        alert('Student added successfully!');
        closeAddStudentModal();
        loadMyStudents();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

async function editStudent(studentId) {
    alert('Edit functionality coming soon!');
}

async function removeStudent(studentId, studentName) {
    if (confirm(`Delete ${studentName}?`)) {
        try {
            await deleteStudent(studentId);
            alert('Student deleted successfully');
            loadMyStudents();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============ STUDENTS BY CLASS ============
async function loadStudentsByClass() {
    const classId = document.getElementById('class-filter').value;
    const tbody = document.getElementById('students-table');

    if (!classId) {
        tbody.innerHTML = '<tr><td colspan="4">Select a class to view students</td></tr>';
        return;
    }

    try {
        const students = await getStudentsByClass(classId);
        
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.admissionNumber}</td>
                <td>${student.dateOfBirth || 'N/A'}</td>
                <td>
                    <button class="btn-small btn-add-grade" onclick="viewStudentGrades('${student.id}')">
                        View Grades
                    </button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4">No students in this class</td></tr>';
    } catch (error) {
        console.error("Error loading students:", error);
        tbody.innerHTML = '<tr><td colspan="4">Error loading students</td></tr>';
    }
}

window.viewStudentGrades = async function(studentId) {
    try {
        const grades = await getStudentGrades(studentId);
        alert(`Student has ${grades.length} grades recorded.`);
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

// ============ GRADING ============
async function loadClassStudentsForGrading() {
    const classId = document.getElementById('grade-class-filter').value;
    const tbody = document.getElementById('grading-table');

    if (!classId) {
        tbody.innerHTML = '<tr><td colspan="4">Select a class to start grading</td></tr>';
        return;
    }

    try {
        currentClass = { id: classId };
        const students = await getStudentsByClass(classId);
        
        tbody.innerHTML = await Promise.all(students.map(async (student) => {
            try {
                const grades = await getStudentGrades(student.id);
                const latestGrade = grades.length > 0 ? grades[0] : null;
                
                return `
                    <tr>
                        <td>${student.name}</td>
                        <td>${latestGrade ? latestGrade.subject : 'No grades yet'}</td>
                        <td>${latestGrade ? latestGrade.score : '-'}</td>
                        <td>
                            <button class="btn-small btn-add-grade" onclick="openGradeModal('${student.id}', '${student.name}')">
                                Add Grade
                            </button>
                        </td>
                    </tr>
                `;
            } catch (e) {
                return `
                    <tr>
                        <td>${student.name}</td>
                        <td colspan="2">Error loading grades</td>
                        <td>
                            <button class="btn-small btn-add-grade" onclick="openGradeModal('${student.id}', '${student.name}')">
                                Add Grade
                            </button>
                        </td>
                    </tr>
                `;
            }
        })).then(rows => rows.join(''));
    } catch (error) {
        console.error("Error loading students for grading:", error);
        tbody.innerHTML = '<tr><td colspan="4">Error loading students</td></tr>';
    }
}

function openGradeModal(studentId, studentName) {
    editingGradeId = null;
    document.getElementById('grade-modal-title').textContent = 'Add Grade';
    document.getElementById('grade-student-name').value = studentName;
    document.getElementById('grade-form').dataset.studentId = studentId;
    document.getElementById('grade-form').reset();
    document.getElementById('grade-date').valueAsDate = new Date();
    document.getElementById('grade-modal').classList.add('active');
}

function closeGradeModal() {
    document.getElementById('grade-modal').classList.remove('active');
    editingGradeId = null;
}

document.getElementById('grade-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const studentId = e.target.dataset.studentId;
        const gradeData = {
            studentId: studentId,
            studentName: document.getElementById('grade-student-name').value,
            classId: currentClass.id,
            subject: document.getElementById('grade-subject').value,
            score: Number(document.getElementById('grade-score').value),
            gradeLetter: document.getElementById('grade-letter').value,
            date: document.getElementById('grade-date').value,
            remarks: document.getElementById('grade-remarks').value,
            teacherId: currentTeacher.id,
            teacherName: currentTeacher.fullName
        };

        if (editingGradeId) {
            await updateGrade(editingGradeId, gradeData);
        } else {
            await addGrade(gradeData);
        }
        
        closeGradeModal();
        loadClassStudentsForGrading();
        alert('Grade saved successfully!');
    } catch (error) {
        alert('Error: ' + error.message);
        console.error("Error saving grade:", error);
    }
});

window.openGradeModal = openGradeModal;
window.closeGradeModal = closeGradeModal;

// ============ GRADE RECORDS ============
async function loadTeacherGrades() {
    try {
        const grades = await getTeacherGrades(currentTeacher.id);
        allGrades = grades;
        
        const tbody = document.getElementById('records-table');
        
        tbody.innerHTML = grades.map(grade => `
            <tr>
                <td>${grade.studentName || 'Unknown'}</td>
                <td>${grade.subject}</td>
                <td>${grade.score}</td>
                <td>${grade.gradeLetter}</td>
                <td>${new Date(grade.date || grade.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn-small btn-edit-grade" onclick="editGradeRecord('${grade.id}')">Edit</button>
                    <button class="btn-small btn-delete-grade" onclick="deleteGradeRecord('${grade.id}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6">No grades recorded yet</td></tr>';
    } catch (error) {
        console.error("Error loading grades:", error);
        document.getElementById('records-table').innerHTML = '<tr><td colspan="6">Error loading grades</td></tr>';
    }
}

window.editGradeRecord = async function(gradeId) {
    const grade = allGrades.find(g => g.id === gradeId);
    if (!grade) return;

    editingGradeId = gradeId;
    document.getElementById('grade-modal-title').textContent = 'Edit Grade';
    document.getElementById('grade-student-name').value = grade.studentName;
    document.getElementById('grade-subject').value = grade.subject;
    document.getElementById('grade-score').value = grade.score;
    document.getElementById('grade-letter').value = grade.gradeLetter;
    document.getElementById('grade-date').value = grade.date || grade.createdAt.split('T')[0];
    document.getElementById('grade-remarks').value = grade.remarks || '';
    document.getElementById('grade-form').dataset.studentId = grade.studentId;
    document.getElementById('grade-modal').classList.add('active');
};

window.deleteGradeRecord = async function(gradeId) {
    if (confirm('Delete this grade? This action cannot be undone.')) {
        try {
            await deleteGrade(gradeId);
            loadTeacherGrades();
            alert('Grade deleted successfully!');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
};

// ============ HELPERS ============
async function getClassGrades(classId) {
    try {
        const grades = await getTeacherGrades(currentTeacher.id);
        return grades.filter(g => g.classId === classId);
    } catch (e) {
        return [];
    }
}

// Logout
function handleLogout() {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    });
}

window.handleLogout = handleLogout;
window.loadMyStudents = loadMyStudents;
window.openAddStudentModal = openAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.editStudent = editStudent;
window.removeStudent = removeStudent;
window.loadStudentsByClass = loadStudentsByClass;
window.loadClassStudentsForGrading = loadClassStudentsForGrading;
window.loadTeacherGrades = loadTeacherGrades;
