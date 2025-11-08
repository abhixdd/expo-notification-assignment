import { Router, Request, Response } from 'express';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { db, COLLECTIONS } from '../firebase';

const router = Router();
const expo = new Expo();

// POST /api/notifications/send (send notification to a user)

router.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, expoPushToken, title, body, data } = req.body;

    // Validate input
    if (!title || !body) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and body are required',
      });
    }

    if (!userId && !expoPushToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Either userId or expoPushToken is required',
      });
    }

    let pushToken = expoPushToken;

    // If userId provided, fetch token from Firestore
    if (userId && !pushToken) {
      const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }

      pushToken = userDoc.data()?.expoPushToken;
    }

    // Validate token
    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or missing push token',
      });
    }

    // Prepare notification message
    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
      priority: 'high',
    };

    // Send notification using Expo Push API
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log('📤 Notification tickets:', ticketChunk);
      } catch (error) {
        console.error('❌ Error sending notification:', error);
      }
    }

    // Check for errors in tickets
    for (const ticket of tickets) {
      if (ticket.status === 'error') {
        console.error(`❌ Notification error: ${ticket.message}`);
        if (ticket.details?.error) {
          console.error(`Error details: ${ticket.details.error}`);
        }
        return res.status(500).json({
          status: 'error',
          message: `Failed to send notification: ${ticket.message}`,
        });
      }
    }

    console.log(`✅ Notification sent: "${title}"`);

    res.json({
      status: 'success',
      message: 'Notification sent successfully',
      data: {
        title,
        body,
        sentAt: new Date().toISOString(),
        tickets,
      },
    });
  } catch (error: any) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to send notification',
    });
  }
});

export default router;
