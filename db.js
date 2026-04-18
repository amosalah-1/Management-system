import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    deleteDoc, 
    doc, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const COLLECTION_NAME = "grades";

export async function addGrade(userId, gradeData) {
    return await addDoc(collection(db, COLLECTION_NAME), {
        ...gradeData,
        userId,
        createdAt: new Date().toISOString()
    });
}

export async function getUserGrades(userId) {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteGrade(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}