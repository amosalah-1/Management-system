# Firebase Setup Instructions

## Step 1: Enable Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **school-management-system-c88fe**
3. Go to **Firestore Database** → **Rules** tab
4. Replace all rules with the content from `firestore.rules`
5. Click **Publish**

### Firestore Rules Content
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own user profile
    match /users/{userId} {
      allow list: if true; // Allow checking for existing administrator roles during signup
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Classes collection - Admins and Teachers can manage
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
                                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
    }

    // Students collection - Admins and Teachers can manage
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
                                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
    }

    // Grades - Teachers can create/update for their students, Students can read their own
    match /grades/{gradeId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.studentId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher']);
      
      allow create, update: if request.auth != null && 
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
      
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin'];
    }

    // Role assignments - Only Admins can manage
    match /roleAssignments/{assignmentId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
                                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 2: Create Database Collections

Navigate to **Firestore Database** → **Data** and create these collections:

### 1. Create "users" Collection
- Click **Create collection**
- Name: `users`
- Add first document:
  - Document ID: `auto-generate` (Firebase will do this when users register)

### 2. Create "classes" Collection
- Click **Create collection**
- Name: `classes`

### 3. Create "students" Collection
- Click **Create collection**
- Name: `students`

### 4. Create "grades" Collection
- Click **Create collection**
- Name: `grades`

## Step 3: Enable Authentication

1. Go to **Authentication** tab
2. Click **Get started**
3. Select **Email/Password** provider
4. Enable it
5. Click **Save**

## Step 4: Set Up Indexes

If you see index recommendations in Firestore, create them:

1. Go to **Firestore Database** → **Indexes**
2. Create any recommended composite indexes
3. Wait for them to be created (usually takes a few minutes)

## Step 5: Host Your Application

### Option A: Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project folder:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

### Option B: Serve Locally

1. Install Firebase CLI (if not already done)
2. Navigate to your project folder
3. Run:
   ```bash
   firebase serve
   ```
4. Open browser to `http://localhost:5000`

### Option C: Use Any Web Server

- Copy all files to your web hosting provider
- Ensure `firebase-config.js` has correct credentials
- Access via your domain

## Step 6: Verify Configuration

1. Test the login page: `login.html`
2. Try creating a student account
3. Check Firestore → Collections → users
4. You should see your new user document

## Step 7: Create First Admin Account

1. Register as a "Teacher" account
2. In Firebase Console:
   - Go to **Firestore Database** → **users** collection
   - Find your document
   - Click the document ID to edit
   - Change `role` field from "teacher" to "admin"
   - Update the document

3. Log out and log back in
4. You should see the Admin Dashboard

## Step 8: Initialize System Data

1. **Create Classes**:
   - Go to Admin Dashboard → Manage Classes
   - Create a class for each grade (1-8)
   - Example: "Class 1A" (Grade 1), "Class 2A" (Grade 2), etc.

2. **Create Teachers**:
   - Ask teachers to register with "Teacher" role
   - Assign them to classes in Manage Classes

3. **Add Students**:
   - Go to Admin Dashboard → Manage Students
   - Add students and assign them to classes

## Security Checklist

- [ ] Firestore Rules published
- [ ] Authentication email/password enabled
- [ ] Collections created
- [ ] Index created (if needed)
- [ ] First admin account created
- [ ] Hosting configured
- [ ] Test login works
- [ ] Test grade creation works
- [ ] Students can view their grades

## Troubleshooting Firebase Setup

### "Missing or insufficient permissions" error
- **Check**: Firestore rules are published
- **Solution**: Go to Rules tab and click "Publish"

### Student can't create account
- **Check**: Email/Password authentication is enabled
- **Solution**: Go to Authentication → Providers → Enable Email/Password

### Data not appearing
- **Check**: Collections exist in Firestore
- **Solution**: Create missing collections manually

### Indexes not created
- **Check**: Look at Firestore logs for recommendations
- **Solution**: Click "Create Index" link in error message
## Resetting the System (Clear All Data)

If you need to start fresh and remove all users, emails, and school data:

### 1. Clear Authentication (Delete Emails)
1. Go to [Authentication](https://console.firebase.google.com/project/school-management-system-c88fe/authentication/users)
2. Select all users by clicking the checkbox at the top of the list.
3. Click the **Delete account** button (trash icon).
4. **Confirm** the deletion. This removes all login credentials from the system.

### 2. Clear Firestore Collections (Delete Data)
1. Go to [Firestore Database](https://console.firebase.google.com/project/school-management-system-c88fe/firestore/data)
2. For each of these collections: `users`, `classes`, `students`, `grades`.
3. Click the three vertical dots (**⋮**) next to the collection name.
4. Select **Delete collection**.
5. Type the collection name to confirm.

**Note:** Once these steps are done, the next person to sign up as an "Admin" will be allowed to do so because the system will be empty.

## Firebase Console Links

For your project `school-management-system-c88fe`:

- **Firestore Database**: https://console.firebase.google.com/project/school-management-system-c88fe/firestore
- **Authentication**: https://console.firebase.google.com/project/school-management-system-c88fe/authentication
- **Hosting**: https://console.firebase.google.com/project/school-management-system-c88fe/hosting

## Environment Configuration

Your Firebase config is in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAvV434K3YNCm0h-MkJ4bHCm4phvaWIYrw",
  authDomain: "school-management-system-c88fe.firebaseapp.com",
  projectId: "school-management-system-c88fe",
  storageBucket: "school-management-system-c88fe.firebasestorage.app",
  messagingSenderId: "835304091930",
  appId: "1:835304091930:web:f1f45570c06a86e15cbca3",
  measurementId: "G-QEZZ32QP37"
};
```

**⚠️ WARNING**: This config is exposed in the browser. Restrict your Firebase rules to prevent unauthorized access.

## Next Steps

1. ✅ Deploy the application
2. ✅ Create first admin account
3. ✅ Add teachers
4. ✅ Create classes
5. ✅ Add students
6. ✅ Start grading!

---

*For more detailed usage instructions, see SYSTEM_GUIDE.md*
