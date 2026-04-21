# Project File Structure Guide

## Core Files

### Authentication & Configuration
- **firebase-config.js** - Firebase configuration (API keys, database settings)
- **auth.js** - User authentication (login, registration with roles)
- **login.html** - Login and signup page

### Database
- **db.js** - All Firestore database functions (CRUD operations)
- **firestore.rules** - Firestore security rules (role-based access control)

### UI & Styling
- **style.css** - All application styles and responsive design
- **index.html** - Student dashboard (grades, statistics, export)
- **utils.js** - Utility functions (GPA calculation, averaging)

### Main Dashboards

#### Admin Dashboard
- **admin-dashboard.html** - Admin interface HTML
- **admin.js** - Admin functionality (manage teachers, classes, students)

#### Teacher Dashboard
- **teacher-dashboard.html** - Teacher interface HTML
- **teacher.js** - Teacher functionality (grade students, view records)

#### Student Dashboard
- **index.html** - Student dashboard HTML
- **dashboard.js** - Student functionality (view grades, statistics)

### Documentation
- **SYSTEM_GUIDE.md** - Complete user guide (workflows, roles, features)
- **FIREBASE_SETUP.md** - Firebase configuration instructions
- **README.md** - Project overview (this file)

### Data Files
- **dataconnect/** - Database configuration directory (Firebase DataConnect)
  - **dataconnect.yaml** - Configuration
  - **seed_data.gql** - Sample data
  - **schema/** - Database schema
  - **example/** - Example queries

---

## File Dependencies

```
graph LR
    A[firebase-config.js] --> B[auth.js]
    A --> C[db.js]
    A --> D[dashboard.js]
    A --> E[admin.js]
    A --> F[teacher.js]
    
    B --> G[login.html]
    B --> D
    B --> E
    B --> F
    
    C --> D
    C --> E
    C --> F
    
    H[firestore.rules] --> A
    I[style.css] --> G
    I --> J[index.html]
    I --> K[admin-dashboard.html]
    I --> L[teacher-dashboard.html]
    
    L[utils.js] --> D
```

---

## File Purposes & Content

### 1. firebase-config.js
**Purpose**: Initialize Firebase services
**Content**: API keys, database reference, auth configuration
**Usage**: Imported in all JavaScript files

```javascript
- Initializes Firebase app
- Exports: auth, db
- Used by: auth.js, db.js, all dashboards
```

### 2. auth.js
**Purpose**: Handle user authentication and registration
**Content**: Login form handler, signup form handler, role selection
**Usage**: Linked to login.html

```javascript
- Login users
- Register new students/teachers
- Role selection during signup
- Redirect to appropriate dashboard
```

### 3. db.js
**Purpose**: All database operations
**Content**: CRUD functions for users, classes, students, grades
**Usage**: Imported in all dashboard scripts

**Functions:**
- User management: `getUserData()`, `updateUserRole()`
- Classes: `createClass()`, `getAllClasses()`, `getClassesByTeacher()`
- Students: `addStudent()`, `getStudentsByClass()`, `deleteStudent()`
- Grades: `addGrade()`, `getStudentGrades()`, `updateGrade()`

### 4. firestore.rules
**Purpose**: Security rules for Firestore database
**Content**: Role-based access control rules
**Deployment**: Via Firebase Console

```
- Users: Can only access own profile
- Teachers: Can create grades, view classes
- Students: Can only see own grades
- Admins: Full system access
```

### 5. admin.js
**Purpose**: Admin dashboard functionality
**Content**: Manage teachers, classes, students, view all grades

**Key Functions:**
- `loadDashboardData()` - System statistics
- `loadTeachers()` - Display all teachers
- `loadClasses()` - Display and manage classes
- `loadStudents()` - Display and manage students
- `loadGradesView()` - View system grades

### 6. admin-dashboard.html
**Purpose**: Admin interface
**Content**: Navigation, modals, tables for management
**Sections:**
- Dashboard (statistics)
- Manage Teachers
- Manage Classes
- Manage Students
- View Grades

### 7. teacher.js
**Purpose**: Teacher dashboard functionality
**Content**: Grade students, view class records

**Key Functions:**
- `loadTeacherDashboard()` - Teacher's classes overview
- `loadStudentsByClass()` - View students in class
- `loadClassStudentsForGrading()` - Show students for grading
- `loadTeacherGrades()` - View grade records

### 8. teacher-dashboard.html
**Purpose**: Teacher interface
**Content**: Navigation, class management, grading interface
**Sections:**
- My Classes (overview)
- My Students (by class)
- Grade Students (add grades)
- Grade Records (view/edit)

### 9. dashboard.js
**Purpose**: Student dashboard functionality
**Content**: Display grades, statistics, charts

**Key Functions:**
- `loadDashboardData()` - Load student's grades
- `renderTable()` - Display grades in table
- `renderCharts()` - Create performance charts
- `addGrade()`, `updateGrade()`, `deleteGrade()` - Legacy functions

### 10. index.html
**Purpose**: Student dashboard interface
**Content**: Grade display, statistics, charts
**Sections:**
- Overview (GPA, average, count)
- Charts (trend, distribution)
- Grade Table
- Export CSV button

### 11. style.css
**Purpose**: All application styling
**Content**: 
- Auth page styles
- Dashboard layouts
- Tables and forms
- Responsive design
- Color scheme

### 12. login.html
**Purpose**: Entry point for all users
**Content**: Login form, signup form with role selection
**Features:**
- Email/password login
- Student/teacher registration
- Role selector

### 13. utils.js
**Purpose**: Utility functions
**Content**: Grade calculations
**Functions:**
- `calculateGPA()` - Calculate grade point average
- `calculateAverage()` - Calculate percentage average

---

## User Role Access Map

```
Student (login.html → index.html)
├─ View personal grades
├─ View statistics (GPA, average)
├─ View charts
└─ Export to CSV

Teacher (login.html → teacher-dashboard.html)
├─ View assigned classes
├─ View class students
├─ Add grades to students
├─ Edit grade records
├─ Delete own grades
└─ View grade statistics

Admin (login.html → admin-dashboard.html)
├─ Dashboard (system statistics)
├─ Manage teachers (view, activate/deactivate)
├─ Manage classes (create, edit, delete, assign teachers)
├─ Manage students (create, edit, delete, assign to class)
├─ View all grades
└─ System maintenance
```

---

## Database Collections

### users
```javascript
{
  userId: { document key }
  fullName: string
  email: string
  role: "admin" | "teacher" | "student"
  school: string (for students)
  isActive: boolean
  createdAt: timestamp
}
```

### classes
```javascript
{
  classId: { document key }
  name: string (e.g., "Class 1A")
  grade: string (1-8)
  teacherId: reference to user
  createdAt: timestamp
}
```

### students
```javascript
{
  studentId: { document key }
  name: string
  admissionNumber: string (unique)
  classId: reference to class
  dateOfBirth: date (YYYY-MM-DD)
  createdAt: timestamp
}
```

### grades
```javascript
{
  gradeId: { document key }
  studentId: reference to student
  studentName: string
  classId: reference to class
  subject: string (English, Kiswahili, Mathematics, etc.)
  score: number (0-100)
  gradeLetter: string (A-F)
  date: date (YYYY-MM-DD)
  remarks: string (optional)
  teacherId: reference to teacher
  teacherName: string
  createdAt: timestamp
}
```

---

## Data Flow Diagram

```
User Registration
  ↓
firebase-config.js (Auth)
  ↓
auth.js (Signup form)
  ↓
db.js (Save to Firestore)
  ↓
firestore.rules (Security check)
  ↓
Login
  ↓
auth.js (Check role)
  ↓
Redirect to:
  ├─ admin-dashboard.html (if admin)
  ├─ teacher-dashboard.html (if teacher)
  └─ index.html (if student)
  
Dashboard Navigation
  ↓
db.js (Fetch data)
  ↓
admin.js / teacher.js / dashboard.js (Process)
  ↓
HTML/CSS (Display)
```

---

## Critical Files for Deployment

These files MUST be present for the system to work:

1. ✅ **firebase-config.js** - Without this, nothing connects to Firebase
2. ✅ **auth.js** - Without this, users can't login/signup
3. ✅ **db.js** - Without this, no data operations work
4. ✅ **firestore.rules** - Must be published to Firebase Console
5. ✅ **login.html** - Entry point for all users

---

## File Sizes (Approximate)

```
firebase-config.js          ~500 B
auth.js                     ~4.5 KB
db.js                       ~6 KB
admin.js                    ~12 KB
teacher.js                  ~10 KB
dashboard.js                ~8 KB
style.css                   ~15 KB
admin-dashboard.html        ~18 KB
teacher-dashboard.html      ~16 KB
login.html                  ~2.5 KB
index.html                  ~3 KB
utils.js                    ~1 KB
firestore.rules             ~1.5 KB
SYSTEM_GUIDE.md             ~12 KB
FIREBASE_SETUP.md           ~8 KB
```

**Total**: ~117 KB (excluding documentation)

---

## Modification Guide

### To Add a New Subject
1. Edit: **teacher-dashboard.html** (grade modal options)
2. Edit: **teacher.js** (subject options)
3. No database changes needed

### To Add a New Grade Level
1. Edit: **admin-dashboard.html** (class-grade select options)
2. Modify: **Grade 1-8** to **Grade 1-X** (wherever grade is defined)

### To Add Authentication Method
1. Edit: **auth.js** (add new auth method)
2. Edit: **firebase-config.js** (if needed)

### To Add Admin Functionality
1. Create new function in **admin.js**
2. Create new section in **admin-dashboard.html**
3. Add security rule in **firestore.rules**

---

## Deployment Checklist

- [ ] All files present
- [ ] firebase-config.js has correct keys
- [ ] firestore.rules published to Firebase
- [ ] Authentication enabled in Firebase
- [ ] Collections created in Firestore
- [ ] Hosted on Firebase Hosting or web server
- [ ] Tested login/signup workflow
- [ ] Tested each user role (admin, teacher, student)
- [ ] Tested grading functionality
- [ ] Backed up database

---

*Version: 1.0.0*
*Last Updated: April 20, 2026*
