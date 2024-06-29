// setCustomClaims.js
import { admin } from './admin';

async function setCustomUserClaims(uid, role) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Custom claims set for user ${uid} with role ${role}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

async function addUserRoles() {
  try {
    // Set role for a teacher
    await setCustomUserClaims('teacher-uid-123', 'teacher');

    // Set role for a student
    await setCustomUserClaims('student-uid-456', 'student');
  } catch (error) {
    console.error('Error adding user roles:', error);
  }
}

addUserRoles();
