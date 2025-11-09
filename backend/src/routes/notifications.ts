import { Router, Request, Response } from 'express';
import admin from '../firebase';
import { db, COLLECTIONS } from '../firebase';

const router = Router();

// POST /api/notifications/send (send notification to a user)

router.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, fcmToken, expoPushToken, title, body, data } = req.body;

    // Validate input
    if (!title || !body) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and body are required',
      });
    }

    if (!userId && !fcmToken && !expoPushToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Either userId, fcmToken, or expoPushToken is required',
      });
    }

    let deviceToken = fcmToken || expoPushToken;

    // If userId provided, fetch token from Firestore
    if (userId && !deviceToken) {
      const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      deviceToken = userDoc.data()?.expoPushToken || userDoc.data()?.fcmToken;
    }

    // Validate token
    if (!deviceToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or missing push token',
      });
    }

    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high' as const,
        notification: {
          channelId: 'default',
          sound: 'default',
        },
      },
    };

    console.log(`📤 Sending notification via Firebase Admin: "${title}"`);
    
    const response = await admin.messaging().send(message);
    
    console.log(`✅ Notification sent successfully! Message ID: ${response}`);

    res.json({
      status: 'success',
      message: 'Notification sent successfully',
      data: {
        title,
        body,
        messageId: response,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('❌ Error sending notification:', error);
    
    // Handle specific FCM errors
    let errorMessage = error.message || 'Failed to send notification';
    if (error.code === 'messaging/invalid-registration-token') {
      errorMessage = 'Invalid device token. Please re-register the device.';
    } else if (error.code === 'messaging/registration-token-not-registered') {
      errorMessage = 'Device token is no longer registered.';
    }
    
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      errorCode: error.code,
    });
  }
});

export default router;
