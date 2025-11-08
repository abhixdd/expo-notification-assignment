import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';

// Initialize Firebase Admin SDK

let serviceAccount: any;

try {
  serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'));
  console.log('✅ Firebase service account loaded');
} catch (error) {
  console.error('❌ Firebase service account file not found!');
  console.error('📁 Expected location: backend/firebase-service-account.json');
  console.error('📖 Download from: Firebase Console > Project Settings > Service Accounts');
  throw new Error('Missing firebase-service-account.json');
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin SDK initialized');
}

// Get Firestore instance
export const db = getFirestore();

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
};

console.log('✅ Firestore initialized');

export default admin;
