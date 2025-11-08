import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/health (To get server status)

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Expo Notification Backend Server is running!',
    timestamp: new Date().toISOString(),
  });
});

export default router;
