"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const path_1 = __importDefault(require("path"));
// Initialize Firebase Admin SDK
let serviceAccount;
try {
    serviceAccount = require(path_1.default.join(__dirname, '../firebase-service-account.json'));
    console.log('✅ Firebase service account loaded');
}
catch (error) {
    console.error('❌ Firebase service account file not found!');
    console.error('📁 Expected location: backend/firebase-service-account.json');
    console.error('📖 Download from: Firebase Console > Project Settings > Service Accounts');
    throw new Error('Missing firebase-service-account.json');
}
// Initialize Firebase Admin
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized');
}
// Get Firestore instance
exports.db = (0, firestore_1.getFirestore)();
// Collection names
exports.COLLECTIONS = {
    USERS: 'users',
};
console.log('✅ Firestore initialized');
exports.default = firebase_admin_1.default;
