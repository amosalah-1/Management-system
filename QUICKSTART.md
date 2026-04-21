# Quick Start Checklist

## 🚀 Getting Your School System Running

### Phase 1: Firebase Configuration (5 minutes)

- [ ] **Publish Firestore Rules**
  1. Go to [Firebase Console](https://console.firebase.google.com)
  2. Select project: `school-management-system-c88fe`
  3. Go to **Firestore Database** → **Rules**
  4. Copy content from `firestore.rules` file
  5. Paste into the Rules editor
  6. Click **Publish**

- [ ] **Enable Email/Password Authentication**
  1. Go to **Authentication** tab
  2. Click **Email/Password**
  3. Toggle it ON
  4. Click **Save**

- [ ] **Verify Firebase Collections**
  1. Go to **Firestore Database** → **Data**
  2. Check these collections exist:
     - `users`
     - `classes`
     - `students`
     - `grades`
  3. Create any missing collections

### Phase 2: Test the System (5 minutes)

- [ ] **Open the Application**
  - Click on `login.html` to open
  - Or use: `http://localhost:5000` if using Firebase emulator

- [ ] **Create First Admin Account**
  1. Click **Create an account**
  2. Enter name: "Admin Test"
  3. Select role: **Teacher** (we'll change this to admin after)
  4. School: "Test School"
  5. Email: `admin@test.com`
  6. Password: `Test123456`
  7. Click **Register**
  8. Go to [Firebase Firestore](https://console.firebase.google.com/project/school-management-system-c88fe/firestore)
  9. Find your user in `users` collection
  10. Click to edit → Change `role` from "teacher" to "admin"
  11. Log out and log back in
  12. ✓ You should see Admin Dashboard

- [ ] **Create Teachers**
  1. Log out (admin)
  2. Create an account with role: **Teacher**
  3. Email: `teacher1@test.com`
  4. Password: `Test123456`
  5. Note: These will be regular teacher accounts

- [ ] **Create Classes**
  1. Log in as admin
  2. Go to **Manage Classes**
  3. Click **Create New Class**
  4. Create:
     - Name: "Class 1A"
     - Grade: 1
     - Teacher: Select your teacher
     - Click **Create Class**
  5. Create more classes for testing (Grade 2, 3, etc.)

- [ ] **Create Students**
  1. Go to **Manage Students**
  2. Click **Add Student**
  3. Fill in:
     - Name: "John Doe"
     - Admission: "12001"
     - Class: "Class 1A"
     - DOB: Any date
  4. Click **Add Student**
  5. Add 2-3 more test students

- [ ] **Test Teacher Grading**
  1. Log out (admin)
  2. Log in as teacher
  3. Go to **Grade Students**
  4. Select "Class 1A"
  5. Click **Add Grade** for a student
  6. Fill in:
     - Subject: English
     - Score: 85
     - Grade: B
     - Date: Today
  7. Click **Save Grade**
  8. ✓ Check **Grade Records** to verify it saved

- [ ] **Test Student View**
  1. Create a student account
  2. Email: `student@test.com`
  3. Password: `Test123456`
  4. Role: **Student**
  5. Log in
  6. ✓ You should see the grades dashboard
  7. ✓ Should show the grades entered

### Phase 3: Go Live

- [ ] **Deploy to Production**
  - Option 1: Firebase Hosting (recommended)
  - Option 2: Any web hosting (needs HTTPS)
  - Option 3: Run locally

- [ ] **Create Real Admin Account**
  1. Have real admin register as "Teacher"
  2. Change role to "admin" in Firebase Console

- [ ] **Invite Teachers**
  1. Teachers register with "Teacher" role
  2. Assign them to classes in admin dashboard

- [ ] **Enroll Students**
  1. Admin adds students
  2. Or students can register with "Student" role
  3. Admin assigns them to classes

---

## 📚 System Roles

### 👨‍💼 Admin
**Can:**
- Create/manage classes
- Assign teachers to classes
- Add/manage students
- View all grades in system
- Deactivate users

**Login:** Email/password set by Firebase admin

### 👨‍🏫 Teacher
**Can:**
- View assigned classes & students
- Add grades for their students
- Edit/delete their own grades
- View grade statistics

**Cannot:**
- See other teachers' classes
- Create classes
- Delete grades (only admins)

### 👨‍🎓 Student
**Can:**
- View personal grades
- View statistics (GPA, average)
- See performance charts
- Export grades to CSV

**Cannot:**
- See other students' grades
- Add or edit grades

---

## 🎓 Kenyan Curriculum Subjects

The system includes these subjects for all grades:

1. **English** - Communication & literacy
2. **Kiswahili** - Language & culture
3. **Mathematics** - Numeracy
4. **Science** - Natural sciences
5. **Social Studies** - Geography & history
6. **Creative Arts** - Art & music
7. **Physical Education** - Sports & health

---

## 📁 File Organization

```
Your School System/
├── 📄 login.html ...................... Entry page
├── 📄 index.html ...................... Student dashboard
├── 📄 admin-dashboard.html ............ Admin interface
├── 📄 teacher-dashboard.html ......... Teacher interface
├── 📄 auth.js ......................... Login/signup
├── 📄 admin.js ........................ Admin functions
├── 📄 teacher.js ..................... Teacher functions
├── 📄 dashboard.js ................... Student functions
├── 📄 db.js .......................... Database functions
├── 📄 firebase-config.js ............. Firebase setup
├── 📄 style.css ....................... Styling
├── 📄 utils.js ........................ Helpers
├── 📄 firestore.rules ................ Security rules
│
├── 📖 SYSTEM_GUIDE.md ................. Complete user manual
├── 📖 FIREBASE_SETUP.md .............. Firebase instructions
├── 📖 PROJECT_STRUCTURE.md ........... File reference
└── 📖 QUICKSTART.md .................. This file
```

---

## 🔧 Troubleshooting

### "Missing or insufficient permissions" error
```
❌ Problem: Can't save grades
✅ Solution: 
   1. Check firestore.rules is PUBLISHED
   2. Check user role in Firestore
   3. Clear browser cache & try again
```

### Student doesn't appear in teacher's view
```
❌ Problem: Teacher can't see assigned students
✅ Solution:
   1. Verify student is in correct class
   2. Check student admissionNumber is set
   3. Refresh the page
```

### Can't login as teacher/admin
```
❌ Problem: Login fails
✅ Solution:
   1. Check email & password are correct
   2. Check user role in Firestore users collection
   3. Verify account is marked as active
```

### Grades not showing up
```
❌ Problem: Added grades but can't see them
✅ Solution:
   1. Check you're logged in as correct role
   2. Go to Firestore → grades collection
   3. Verify grade documents exist
   4. Hard refresh browser (Ctrl+Shift+R)
```

---

## 📊 Grade Scale

The system uses this grading scale:

| Grade | Score Range | Meaning |
|-------|-------------|---------|
| A | 90-100 | Excellent |
| B | 80-89 | Very Good |
| C | 70-79 | Good |
| D | 60-69 | Satisfactory |
| E | 50-59 | Passable |
| F | <50 | Fail |

---

## 💡 Pro Tips

1. **Bulk Import Students**
   - Not yet available, but can be added
   - Currently: Manual entry via admin dashboard

2. **Export Student Grades**
   - Students can export their grades to CSV
   - Teachers can get reports from admin

3. **Regular Backups**
   - Firestore auto-backs up
   - But export data monthly to be safe

4. **Mobile Access**
   - The system is mobile-friendly
   - Teachers can add grades on tablets

5. **Performance**
   - System works best with <500 students
   - For larger schools, consider adding filters

---

## 🔐 Security Reminders

✅ **Good Practices:**
- Change default passwords
- Use strong admin password
- Don't share admin login
- Regular backups
- Review user access monthly

❌ **Avoid:**
- Sharing Firebase config publicly
- Weak passwords
- Leaving admin logged in
- Storing passwords in emails
- Public WiFi for admin access

---

## 📞 Need Help?

### Common Questions

**Q: How do I reset a user password?**
A: Go to Firebase Console → Authentication → Find user → Click reset password

**Q: Can I export all grades?**
A: Go to Firestore → grades collection → Click ⋮ → Export Collection

**Q: How many students can the system handle?**
A: Firebase Firestore can handle millions of records

**Q: Can I add new subjects?**
A: Yes, edit teacher-dashboard.html grade modal

**Q: Is my data safe?**
A: Yes, Firestore has end-to-end encryption

---

## 📋 First Week Tasks

1. **Day 1**: Set up Firebase rules & authentication
2. **Day 2**: Create admin account & test system
3. **Day 3**: Create classes & add teachers
4. **Day 4**: Enroll students
5. **Day 5**: Test teacher grading workflow

---

## ✨ Next Steps

1. Follow Phase 1 checklist above (5 mins)
2. Complete Phase 2 testing (5 mins)
3. Read SYSTEM_GUIDE.md for detailed workflows
4. Share credentials with teachers
5. Start using the system!

---

**Version**: 1.0.0  
**Last Updated**: April 20, 2026  
**Created for**: Kenyan Primary Schools (Grades 1-8)

Good luck with your school management system! 🎓
