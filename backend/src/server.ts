import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './firebase';


import healthRoutes from './routes/health';
import usersRoutes from './routes/users';
import notificationsRoutes from './routes/notifications';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.use('/', healthRoutes);

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n============================================');
  console.log('   Expo Notification Backend Server Started!');
  console.log('============================================\n');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n - Available Endpoints:');
  console.log(`   GET    http://localhost:${PORT}/`);
  console.log(`   POST   http://localhost:${PORT}/api/users/register`);
  console.log(`   GET    http://localhost:${PORT}/api/users/:userId`);
  console.log(`   GET    http://localhost:${PORT}/api/users`);
  console.log(`   POST   http://localhost:${PORT}/api/notifications/send`);
  console.log('\n✅ Backend is ready to accept requests!\n');
});

export default app;
