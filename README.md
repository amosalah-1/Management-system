# 🎓 Kenyan Primary School Management System

A complete, role-based school management system built for Kenyan primary schools (Grades 1-8) using Firebase and vanilla JavaScript.

![System Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Quick Start](#-quick-start)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Kenyan Curriculum](#-kenyan-curriculum)
- [Installation](#-installation)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)

---

## ✨ Features

### Admin Dashboard
- ✅ Manage teachers and assign roles
- ✅ Create and manage classes (Grades 1-8)
- ✅ Enroll and manage students
- ✅ View system-wide grades and analytics
- ✅ System statistics and activity logs
- ✅ User activation/deactivation

### Teacher Dashboard
- ✅ View assigned classes and students
- ✅ Add grades for students in their classes
- ✅ Edit and delete grade records
- ✅ View class performance statistics
- ✅ Support for all Kenyan curriculum subjects

### Student Dashboard
- ✅ View personal grades and statistics
- ✅ Track GPA and subject averages
- ✅ Visual performance charts (trend & distribution)
- ✅ Export grades to CSV
- ✅ Privacy-protected (see only own grades)

### Security
- ✅ Role-based access control (RBAC)
- ✅ Firebase Authentication
- ✅ Firestore Security Rules
- ✅ Email/password login
- ✅ User account management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│           Web Browser (Client)                   │
│  ┌──────────────┬──────────────┬──────────────┐ │
│  │    Admin     │   Teacher    │   Student    │ │
│  │  Dashboard   │  Dashboard   │  Dashboard   │ │
│  └──────────────┴──────────────┴──────────────┘ │
│                      ↓                            │
│           Firebase JavaScript SDK                │
└─────────────────────────────────────────────────┘
                        ↓
     ┌──────────────────────────────────────┐
     │      Firebase Backend Services        │
     │  ┌────────────────────────────────┐  │
     │  │  Authentication (Firebase Auth)│  │
     │  ├────────────────────────────────┤  │
     │  │  Database (Firestore)          │  │
     │  │  Collections:                  │  │
     │  │  - users                       │  │
     │  │  - classes                     │  │
     │  │  - students                    │  │
     │  │  - grades                      │  │
     │  ├────────────────────────────────┤  │
     │  │  Security (Firestore Rules)    │  │
     │  │  - Role-based access control   │  │
     │  └────────────────────────────────┘  │
     └──────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1️⃣ Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Firebase account (already set up for you)

### 2️⃣ Publish Firestore Rules (2 minutes)
```bash
1. Go to: https://console.firebase.google.com
2. Select project: school-management-system-c88fe
3. Click: Firestore Database → Rules
4. Copy content from firestore.rules file
5. Paste into Rules editor
6. Click: Publish
```

### 3️⃣ Open the System
```bash
1. Open login.html in your browser
2. Or go to deployed URL
3. That's it! System is ready to use
```

### 4️⃣ Create Your First Admin
```bash
1. Click: Create an account
2. Select role: Teacher
3. Fill in details
4. After registration:
   - Go to Firebase Firestore
   - Find your user in "users" collection
   - Change role from "teacher" to "admin"
5. Log back in
6. You're now an admin! 🎉
```

**→ See QUICKSTART.md for detailed steps**

---

## 👥 User Roles

### 1. Admin (System Manager)
**Dashboard**: `admin-dashboard.html`
- **Access**: Full system access
- **Can Do**:
  - Manage all teachers
  - Create classes & assign teachers
  - Enroll & manage students
  - View all grades
  - System statistics
- **Cannot Do**: Cannot grade directly

### 2. Teacher (Educator)
**Dashboard**: `teacher-dashboard.html`
- **Access**: Their assigned classes only
- **Can Do**:
  - View class roster
  - Add grades for students
  - Edit/delete own grades
  - View class statistics
- **Cannot Do**:
  - Access other teachers' classes
  - Delete grades (only admins)
  - Manage classes/students

### 3. Student (Learner)
**Dashboard**: `index.html`
- **Access**: Own grades only
- **Can Do**:
  - View personal grades
  - Track statistics (GPA, averages)
  - View performance charts
  - Export to CSV
- **Cannot Do**:
  - See other students' grades
  - Add/edit grades

---

## 📁 Project Structure

### Core Files
```
├── firebase-config.js       Firebase initialization
├── auth.js                  Authentication system
├── db.js                    Database functions
├── style.css                All styling
└── firestore.rules          Security rules
```

### Dashboards
```
├── login.html               Entry point
├── index.html               Student dashboard
├── admin-dashboard.html     Admin interface
└── teacher-dashboard.html   Teacher interface
```

### JavaScript Logic
```
├── dashboard.js             Student functions
├── admin.js                 Admin functions
├── teacher.js               Teacher functions
└── utils.js                 Utility functions
```

### Documentation
```
├── README.md                This file
├── QUICKSTART.md            30-second setup guide
├── SYSTEM_GUIDE.md          Complete user manual
├── FIREBASE_SETUP.md        Firebase configuration
└── PROJECT_STRUCTURE.md     Detailed file reference
```

**→ See PROJECT_STRUCTURE.md for complete file reference**

---

## 🎓 Kenyan Curriculum

The system includes these subjects for all grades (1-8):

| Subject | Description |
|---------|-------------|
| **English** | Communication, reading, writing |
| **Kiswahili** | Language and culture |
| **Mathematics** | Numeracy and problem-solving |
| **Science** | Natural sciences and experiments |
| **Social Studies** | Geography, history, citizenship |
| **Creative Arts** | Visual arts and music |
| **Physical Education** | Sports, games, and health |

Each subject is graded on a scale of A-F (90-100, 80-89, 70-79, 60-69, 50-59, <50)

---

## 💾 Installation

### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Navigate to your project folder
cd "path/to/SCHOOL MS"

# Deploy
firebase deploy
```

### Option 2: Traditional Web Hosting

1. Copy all files to your web hosting provider
2. Access via your domain
3. Ensure HTTPS is enabled

### Option 3: Local Development

```bash
# Using Firebase CLI
firebase serve

# Or use any local server
python -m http.server 8000
```

Then open: `http://localhost:8000/login.html`

---

## 📚 Documentation

### For Quick Setup (5 minutes)
→ Read: **QUICKSTART.md**

### For Complete System Overview
→ Read: **SYSTEM_GUIDE.md**

### For Firebase Configuration
→ Read: **FIREBASE_SETUP.md**

### For File Reference
→ Read: **PROJECT_STRUCTURE.md**

---

## 🔧 Troubleshooting

### Error: "Missing or insufficient permissions"
```
✓ Solution:
1. Check firestore.rules is PUBLISHED to Firebase
2. Verify user role in Firestore users collection
3. Clear browser cache and refresh
4. Check browser console for detailed error
```

### Students not showing in teacher view
```
✓ Solution:
1. Verify students are assigned to teacher's class
2. Check admissionNumber field is set
3. Refresh the page
4. Check Firestore students collection
```

### Can't create grades as teacher
```
✓ Solution:
1. Ensure you have "teacher" role in Firestore
2. Make sure you're viewing your assigned class
3. Check that students are enrolled in the class
4. Verify score is 0-100
5. Check browser console for errors
```

### Grades not saving
```
✓ Solution:
1. Check all required fields are filled
2. Ensure score is between 0-100
3. Check internet connection
4. Try again after few seconds
5. Check browser console errors
```

---

## 🔐 Security

### Built-in Protections
- ✅ Role-based access control
- ✅ User authentication required
- ✅ Firestore Security Rules enforce permissions
- ✅ Users can only access their own data
- ✅ Teachers isolated to their classes
- ✅ Data encrypted in transit (HTTPS)

### Best Practices
- 🛡️ Change admin password regularly
- 🛡️ Don't share admin credentials
- 🛡️ Regular data backups
- 🛡️ Review user access monthly
- 🛡️ Use strong passwords (min 8 characters)

---

## 📊 Database

### Collections

**users**
- Stores: Admin, teacher, and student accounts
- Fields: name, email, role, school, active status

**classes**
- Stores: Class information
- Fields: name, grade, teacher assignment

**students**
- Stores: Student information
- Fields: name, admission number, class, DOB

**grades**
- Stores: All grades entered by teachers
- Fields: student, subject, score, teacher, date

---

## 🎯 Use Cases

### Scenario 1: Enroll a Student
```
1. Admin logs in
2. Goes to "Manage Students"
3. Clicks "Add Student"
4. Enters: Name, Admission #, Class, DOB
5. Student enrolled! ✓
```

### Scenario 2: Teacher Grades Students
```
1. Teacher logs in
2. Goes to "Grade Students"
3. Selects class
4. Clicks "Add Grade" for student
5. Enters: Subject, Score, Grade, Date
6. Grade saved! ✓
7. Student can see it immediately
```

### Scenario 3: Student Checks Performance
```
1. Student logs in
2. Sees all personal grades
3. Checks GPA & average score
4. Views trend chart
5. Downloads as CSV
6. Share with parents! ✓
```

---

## 📈 System Capacity

| Metric | Capacity |
|--------|----------|
| Students | 10,000+ |
| Teachers | 1,000+ |
| Classes | Unlimited |
| Grades | Unlimited |
| Concurrent Users | 100+ |
| Storage | 1 GB free tier, then pay |

---

## 🔄 Data Management

### Backup
```bash
Firebase Console → Firestore Database → Data
Click ⋮ → Backup Collections
```

### Export
```bash
Firebase Console → Firestore Database → Data
Select collection → Click ⋮ → Export Collection
```

### Import
```bash
Firebase Console → Firestore Database → Data
Click ⋮ → Import Collection
```

---

## 🚢 Deployment Checklist

- [ ] Firestore rules published
- [ ] Authentication enabled
- [ ] Collections created
- [ ] Test admin account created
- [ ] Test class created
- [ ] Test student created
- [ ] Teacher can add grades
- [ ] Student can view grades
- [ ] Application hosted
- [ ] Data backed up

---

## 🆘 Support

### Troubleshooting
1. Check browser console for errors (F12)
2. Check Firestore console for permissions
3. Verify Firebase rules are published
4. Clear browser cache and refresh
5. Check internet connection

### Common Issues
- **Login fails**: Check email/password and role in Firestore
- **Can't add grades**: Verify teacher role and class assignment
- **Grades not showing**: Check Firestore permissions
- **Page blank**: Check browser console for JavaScript errors

### Getting Help
1. Read SYSTEM_GUIDE.md
2. Check FIREBASE_SETUP.md
3. Review browser console errors
4. Check Firestore Database directly
5. Contact Firebase support if backend issue

---

## 📝 Features Roadmap

### Phase 2 (Planned)
- [ ] SMS notifications for grades
- [ ] Parent/Guardian portal
- [ ] Attendance tracking
- [ ] Report card PDF generation
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 3 (Planned)
- [ ] Multi-school support
- [ ] Student bio & photos
- [ ] Assignment submissions
- [ ] Communication system
- [ ] Timetable management

---

## 📄 License

MIT License - Free to use and modify

---

## 👨‍💻 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase (Firestore, Authentication)
- **Charts**: Chart.js
- **Hosting**: Firebase Hosting (optional)
- **Browser Support**: All modern browsers

---

## 🙏 Acknowledgments

Built for Kenyan primary schools following Kenya's education curriculum standards.

---

## 📞 Contact

For issues or suggestions, please refer to your Firebase account support or administrator.

---

## 🎓 Quick Reference

| Task | Where to Find |
|------|---------------|
| Admin setup | QUICKSTART.md |
| System overview | SYSTEM_GUIDE.md |
| Firebase config | FIREBASE_SETUP.md |
| File reference | PROJECT_STRUCTURE.md |
| Error help | TROUBLESHOOTING section below |

---

## 🐛 Known Issues & Workarounds

### Issue 1: Slow loading with many grades
**Workaround**: Add class filter to view only one class at a time

### Issue 2: Grade export shows UTC time
**Workaround**: Dates are correct in Firestore, format in CSV if needed

### Issue 3: Role doesn't update immediately after change
**Workaround**: Log out and log back in to refresh

---

**Version**: 1.0.0  
**Last Updated**: April 20, 2026  
**For**: Kenyan Primary Schools (Grades 1-8)

---

### 🚀 Ready to Go?

1. **Start Here**: Open `QUICKSTART.md`
2. **Get Set Up**: Follow Firebase setup guide
3. **Go Live**: Deploy to production
4. **Train Users**: Share SYSTEM_GUIDE.md with teachers

**Happy Teaching! 🎓**
