export const GRADE_POINTS = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };

/**
 * Calculates GPA based on an array of grade objects
 */
export function calculateGPA(grades) {
    if (grades.length === 0) return "0.00";
    const totalPoints = grades.reduce((acc, curr) => acc + (GRADE_POINTS[curr.gradeLetter] || 0), 0);
    return (totalPoints / grades.length).toFixed(2);
}

export function calculateAverage(grades) {
    if (grades.length === 0) return 0;
    const totalScore = grades.reduce((acc, curr) => acc + Number(curr.score), 0);
    return Math.round(totalScore / grades.length);
}