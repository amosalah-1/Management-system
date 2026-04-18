import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getUserGrades, deleteGrade, addGrade } from './db.js';
import { calculateGPA, calculateAverage } from './utils.js';

let trendChart;
let distChart;

// 1. Check Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('welcome-msg').innerText = `Welcome, ${user.displayName || 'Student'}`;
        loadDashboardData(user.uid);
    } else {
        // If no user is logged in, redirect to login page
        window.location.href = 'login.html'; 
    }
});

// 2. Load and Render Data
async function loadDashboardData(userId) {
    try {
        const grades = await getUserGrades(userId);
        
        // Update Stats UI
        document.getElementById('stat-gpa').innerText = calculateGPA(grades);
        document.getElementById('stat-avg').innerText = `${calculateAverage(grades)}%`;
        document.getElementById('stat-count').innerText = grades.length;

        renderTable(grades);
        renderCharts(grades);
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

// 3. UI Rendering Functions
function renderTable(grades) {
    const container = document.getElementById('grade-list');
    if (grades.length === 0) {
        container.innerHTML = '<tr><td colspan="5">No grades recorded yet.</td></tr>';
        return;
    }

    container.innerHTML = grades.map(g => `
        <tr>
            <td>${g.subject}</td>
            <td>${g.score}%</td>
            <td>${g.gradeLetter}</td>
            <td>${new Date(g.date).toLocaleDateString()}</td>
            <td>
                <button class="btn-delete" data-id="${g.id}">Delete</button>
            </td>
        </tr>
    `).join('');

    // Attach delete listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('Are you sure you want to delete this grade?')) {
                await deleteGrade(e.target.dataset.id);
                loadDashboardData(auth.currentUser.uid);
            }
        });
    });
}

function renderCharts(grades) {
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    const distCtx = document.getElementById('distributionChart').getContext('2d');

    if (trendChart) trendChart.destroy();
    if (distChart) distChart.destroy();

    const chartData = [...grades].reverse(); // Show oldest to newest

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: chartData.map(g => g.date),
            datasets: [{
                label: 'Performance Trend',
                data: chartData.map(g => g.score),
                borderColor: '#27ae60',
                tension: 0.1
            }]
        }
    });

    // Grade Distribution Pie Chart
    const counts = grades.reduce((acc, g) => {
        acc[g.gradeLetter] = (acc[g.gradeLetter] || 0) + 1;
        return acc;
    }, {});

    distChart = new Chart(distCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: [
                    '#27ae60', // A
                    '#2ecc71', // B
                    '#f1c40f', // C
                    '#e67e22', // D
                    '#e74c3c'  // F
                ]
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: 'Grade Distribution' }
            }
        }
    });
}

// 4. Logout Logic
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = 'login.html');
});

// 5. Modal Logic for Adding Grades
const modal = document.getElementById('grade-modal');
const addBtn = document.getElementById('add-grade-btn');
const closeBtn = document.getElementById('close-modal');
const gradeForm = document.getElementById('add-grade-form');

addBtn.onclick = () => modal.classList.remove('hidden');
closeBtn.onclick = () => modal.classList.add('hidden');

gradeForm.onsubmit = async (e) => {
    e.preventDefault();
    const gradeData = {
        subject: document.getElementById('grade-subject').value,
        score: document.getElementById('grade-score').value,
        gradeLetter: document.getElementById('grade-letter').value,
        date: document.getElementById('grade-date').value
    };

    try {
        await addGrade(auth.currentUser.uid, gradeData);
        gradeForm.reset();
        modal.classList.add('hidden');
        loadDashboardData(auth.currentUser.uid); // Refresh UI
    } catch (error) {
        console.error("Error adding grade:", error);
        alert("Failed to add grade.");
    }
};

// 6. Export to CSV
document.getElementById('export-csv-btn').addEventListener('click', async () => {
    const grades = await getUserGrades(auth.currentUser.uid);
    if (grades.length === 0) {
        alert("No grades to export.");
        return;
    }

    const headers = ["Subject", "Score", "Grade", "Date"];
    const rows = grades.map(g => [
        `"${g.subject}"`,
        g.score,
        g.gradeLetter,
        g.date
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Grades_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});