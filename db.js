import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc, 
    orderBy,
    updateDoc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============ USER MANAGEMENT ============
export async function getUserData(userId) {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
}

export async function updateUserRole(userId, role) {
    await updateDoc(doc(db, "users", userId), { role });
}

// ============ CLASS MANAGEMENT ============
export async function createClass(classData) {
    return await addDoc(collection(db, "classes"), {
        ...classData,
        createdAt: new Date().toISOString()
    });
}

export async function getAllClasses() {
    const q = query(collection(db, "classes"), orderBy("grade", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getClassesByGrade(grade) {
    const q = query(collection(db, "classes"), where("grade", "==", grade));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getClassesByTeacher(teacherId) {
    const q = query(collection(db, "classes"), where("teacherId", "==", teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateClass(classId, classData) {
    await updateDoc(doc(db, "classes", classId), classData);
}

export async function deleteClass(classId) {
    await deleteDoc(doc(db, "classes", classId));
}

// ============ STUDENT MANAGEMENT ============
export async function addStudent(studentData) {
    return await addDoc(collection(db, "students"), {
        ...studentData,
        createdAt: new Date().toISOString()
    });
}

export async function getStudentsByTeacher(teacherId, className) {
    const q = query(collection(db, "students"), 
        where("teacherId", "==", teacherId),
        where("className", "==", className)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getStudentsByClass(classId) {
    const q = query(collection(db, "students"), where("classId", "==", classId), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getStudentById(studentId) {
    const studentDoc = await getDoc(doc(db, "students", studentId));
    return studentDoc.exists() ? { id: studentId, ...studentDoc.data() } : null;
}

export async function updateStudent(studentId, studentData) {
    await updateDoc(doc(db, "students", studentId), studentData);
}

export async function deleteStudent(studentId) {
    await deleteDoc(doc(db, "students", studentId));
}

// ============ GRADE MANAGEMENT ============
export async function addGrade(gradeData) {
    return await addDoc(collection(db, "grades"), {
        ...gradeData,
        createdAt: new Date().toISOString()
    });
}

export async function getStudentGrades(studentId) {
    const q = query(collection(db, "grades"), where("studentId", "==", studentId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getClassGrades(classId) {
    const q = query(collection(db, "grades"), where("classId", "==", classId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getTeacherGrades(teacherId) {
    const q = query(collection(db, "grades"), where("teacherId", "==", teacherId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateGrade(gradeId, gradeData) {
    await updateDoc(doc(db, "grades", gradeId), gradeData);
}

export async function deleteGrade(gradeId) {
    await deleteDoc(doc(db, "grades", gradeId));
}

// ============ TEACHER MANAGEMENT (ADMIN ONLY) ============
export async function getAllTeachers() {
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAllStudents() {
    const q = query(collection(db, "students"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============ OLD FUNCTIONS (KEPT FOR COMPATIBILITY) ============
export async function getUserGrades(userId) {
    const q = query(collection(db, "grades"), where("studentId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}