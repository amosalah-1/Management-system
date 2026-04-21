# Kenyan Primary School Management System
## Complete User Guide

## System Overview

This is a comprehensive school management system designed for Kenyan primary schools (Grades 1-8). The system includes:

- **Admin Dashboard**: Manage teachers, classes, students, and view system-wide grades
- **Teacher Dashboard**: View assigned classes, grade students, and manage grade records
- **Student Dashboard**: View personal grades and academic performance

### User Roles

1. **Admin**: Full system access
   - Create and manage classes
   - Assign teachers to classes
   - Manage students
   - View all grades
   - Deactivate users

2. **Teacher**: Class-based access
   - View assigned classes and students
   - Add and edit grades
   - View grade records
   - Cannot access other teachers' classes

3. **Student**: Personal access only
   - View personal grades
   - View academic statistics
   - Export grades to CSV
   - Cannot access other students' information

---

## Getting Started

### 1. Initial Setup

#### A. First Admin Account
To create the first admin account:
1. Go to login page
2. Click "Create an account"
3. Select role: **Teacher** (temporary)
4. Complete registration
5. In Firebase Console:
   - Go to Firestore Database → users collection
   - Find your account
   - Change `role` field from "teacher" to "admin"
6. Log out and log back in
7. You should be redirected to admin dashboard

#### B. Creating Teachers
As an admin:
1. Go to Admin Dashboard → Manage Teachers
2. Click "Add New Teacher"
3. Enter teacher details (Note: Full teacher creation requires Firebase Admin SDK)
4. Teachers can sign up directly as "Teacher" role
5. You can manage their assignments in the Classes section

#### C. Creating Classes
As an admin:
1. Go to Admin Dashboard → Manage Classes
2. Click "Create New Class"
3. Select:
   - Class name (e.g., "Class 1A")
   - Grade level (1-8)
   - Assign teacher
4. Click "Create Class"

#### D. Adding Students
As an admin:
1. Go to Admin Dashboard → Manage Students
2. Click "Add Student"
3. Enter:
   - Student name
   - Admission number
   - Select class
   - Date of birth (optional)
4. Click "Add Student"

---

## Kenyan Primary School Curriculum

The system supports the following subjects across Grades 1-8:

1. **English** - Communication and literacy
2. **Kiswahili** - Language and culture
3. **Mathematics** - Numeracy and problem-solving
4. **Science** - Natural sciences
5. **Social Studies** - Geography and history
6. **Creative Arts** - Art and music
7. **Physical Education** - Sports and health

---

## Teacher Workflow

### Grading Students

1. **Log in** as a teacher
2. Go to "Grade Students" tab
3. Select your class from the dropdown
4. You'll see all students in the class
5. Click "Add Grade" next to a student
6. Fill in:
   - **Subject**: Select from the curriculum subjects
   - **Score**: 0-100
   - **Grade Letter**: A-F (auto-calculated based on score)
   - **Date**: When the assessment was done
   - **Remarks**: Optional notes
7. Click "Save Grade"

### Grade Conversion
- **A**: 90-100
- **B**: 80-89
- **C**: 70-79
- **D**: 60-69
- **E**: 50-59
- **F**: Below 50

### Viewing Grade Records

1. Go to "Grade Records" tab
2. View all grades you've entered
3. Click "Edit" to modify a grade
4. Click "Delete" to remove a grade

---

## Student Workflow

### Viewing Grades

1. **Log in** as a student
2. On the dashboard, you'll see:
   - **GPA**: Overall grade point average
   - **Average Score**: Percentage average
   - **Subjects**: Number of subjects graded
3. View the trend chart showing your performance over time
4. View the distribution chart showing your grades breakdown

### Exporting Grades

1. Click "Export CSV" button
2. A CSV file will download with your grades
3. Open in Excel or Google Sheets

---

## Database Structure

### Collections in Firestore

#### **users**
```
{
  fullName: "John Doe",
  email: "john@example.com",
  role: "admin|teacher|student",
  school: "School name",
  isActive: true,
  createdAt: "ISO date"
}
```

#### **classes**
```
{
  name: "Class 1A",
  grade: "1",
  teacherId: "teacher_uid",
  createdAt: "ISO date"
}
```

#### **students**
```
{
  name: "Student Name",
  admissionNumber: "12345",
  classId: "class_id",
  dateOfBirth: "YYYY-MM-DD",
  createdAt: "ISO date"
}
```

#### **grades**
```
{
  studentId: "student_uid",
  studentName: "Student Name",
  classId: "class_id",
  subject: "English",
  score: 85,
  gradeLetter: "B",
  date: "YYYY-MM-DD",
  remarks: "Good performance",
  teacherId: "teacher_uid",
  teacherName: "Teacher Name",
  createdAt: "ISO date"
}
```

---

## Security & Permissions

The system uses Firebase Security Rules to enforce:

✓ **Users** can only read/write their own profile
✓ **Teachers** can create grades for any student
✓ **Students** can only see their own grades
✓ **Admins** can delete any grade
✓ **Class access** is role-based

---

## Troubleshooting

### Error: "Missing or insufficient permissions"
**Solution**: 
1. Check Firestore rules are published
2. Verify user role is correctly set
3. Clear browser cache and log in again

### Students not appearing in teacher's view
**Solution**:
1. Verify students are assigned to the teacher's class
2. Check admissionNumber is correctly set
3. Refresh the page

### Grade not saving
**Solution**:
1. Ensure all required fields are filled
2. Score must be 0-100
3. Check browser console for errors
4. Verify Firestore rules are published

### Cannot log in as teacher/admin
**Solution**:
1. Verify email and password are correct
2. Check user role in Firestore users collection
3. Ensure user account is marked as active

---

## Admin Tips

### Bulk Student Import
Currently: Manual entry via admin panel
Future: Will support CSV import

### Resetting Passwords
1. Go to Firebase Console
2. Authentication section
3. Find user email
4. Click "Reset Password"
5. Send link to user

### Backing Up Data
1. Go to Firebase Console
2. Firestore Database
3. Use "Export" option to backup collections

---

## System Features Summary

| Feature | Admin | Teacher | Student |
|---------|-------|---------|---------|
| View Dashboard | ✓ | ✓ | ✓ |
| Create Classes | ✓ | ✗ | ✗ |
| Manage Students | ✓ | ✗ | ✗ |
| Assign Teachers | ✓ | ✗ | ✗ |
| View Classes | ✓ | ✓ | ✗ |
| View Students | ✓ | ✓ | ✗ |
| Add Grades | ✓ | ✓ | ✗ |
| View Grades | ✓ | ✓ | ✓ |
| Edit Grades | ✓ | ✓ | ✗ |
| Delete Grades | ✓ | ✗ | ✗ |
| Export Grades | ✓ | ✓ | ✓ |

---

## Support & Maintenance

### Regular Tasks

**Daily:**
- Check system is accessible
- Monitor grade submissions

**Weekly:**
- Review new student enrollments
- Check teacher activity

**Monthly:**
- Back up data
- Review system logs
- Update student information

---

## Future Enhancements

- SMS notifications for grades
- Parent/Guardian portal
- Attendance tracking
- Report card generation
- Advanced analytics and insights
- Multi-school support
- Mobile app

---

## Contact & Support

For technical issues or questions about the system, please contact the administrator.

---

*Last Updated: April 20, 2026*
*Version: 1.0.0*
