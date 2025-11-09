"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expo_server_sdk_1 = require("expo-server-sdk");
const firebase_1 = require("../firebase");
const firestore_1 = require("firebase-admin/firestore");
const router = (0, express_1.Router)();
const expo = new expo_server_sdk_1.Expo();
// POST /api/users/register (Register a new user)
router.post('/register', async (req, res) => {
    try {
        const { name, expoPushToken } = req.body;
        // Validate input
        if (!name || !expoPushToken) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and expoPushToken are required',
            });
        }
        // Validate Expo push token format
        if (!expo_server_sdk_1.Expo.isExpoPushToken(expoPushToken)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Expo push token format',
            });
        }
        // Check if user with this token already exists
        const usersRef = firebase_1.db.collection(firebase_1.COLLECTIONS.USERS);
        const existingUserQuery = await usersRef
            .where('expoPushToken', '==', expoPushToken)
            .limit(1)
            .get();
        if (!existingUserQuery.empty) {
            const existingDoc = existingUserQuery.docs[0];
            return res.json({
                status: 'success',
                message: 'User already registered',
                data: {
                    userId: existingDoc.id,
                    name: existingDoc.data().name,
                    expoPushToken: existingDoc.data().expoPushToken,
                    createdAt: existingDoc.data().createdAt,
                },
            });
        }
        // Create new user document
        const userDoc = await usersRef.add({
            name,
            expoPushToken,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        console.log(`✅ User registered: ${userDoc.id}`);
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                userId: userDoc.id,
                name,
                expoPushToken,
                createdAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('❌ Error registering user:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to register user',
        });
    }
});
// GET /api/users/:userId (Get user by ID)
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userDoc = await firebase_1.db.collection(firebase_1.COLLECTIONS.USERS).doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }
        res.json({
            status: 'success',
            data: {
                userId: userDoc.id,
                ...userDoc.data(),
            },
        });
    }
    catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch user',
        });
    }
});
// GET /api/users (Get all users for testing purposes ExpoPush Token is visible here)
router.get('/', async (req, res) => {
    try {
        const usersSnapshot = await firebase_1.db.collection(firebase_1.COLLECTIONS.USERS).get();
        const users = usersSnapshot.docs.map(doc => ({
            userId: doc.id,
            ...doc.data(),
        }));
        res.json({
            status: 'success',
            data: {
                users,
                count: users.length,
            },
        });
    }
    catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch users',
        });
    }
});
exports.default = router;
