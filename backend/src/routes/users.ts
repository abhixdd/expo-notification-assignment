import { Router, Request, Response } from 'express';
import { Expo } from 'expo-server-sdk';
import { db, COLLECTIONS } from '../firebase';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();
const expo = new Expo();

// POST /api/users/register (Register a new user)

router.post('/register', async (req: Request, res: Response) => {
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
    if (!Expo.isExpoPushToken(expoPushToken)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Expo push token format',
      });
    }

    // Check if user with this token already exists
    const usersRef = db.collection(COLLECTIONS.USERS);
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
      createdAt: FieldValue.serverTimestamp(),
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
  } catch (error: any) {
    console.error('❌ Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to register user',
    });
  }
});


 // GET /api/users/:userId (Get user by ID)

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();

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
  } catch (error: any) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch user',
    });
  }
});

// GET /api/users (Get all users for testing purposes ExpoPush Token is visible here)

router.get('/', async (req: Request, res: Response) => {
  try {
    const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();
    
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
  } catch (error: any) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch users',
    });
  }
});

export default router;
