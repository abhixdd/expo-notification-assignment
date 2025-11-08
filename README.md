# Expo Push Notification System

A complete push notification system built with **React Native (Expo)** for the frontend and **Node.js (Express)** for the backend. This project demonstrates real-time push notifications with user registration, notification sending, and a beautiful dark-themed UI.

## Repository Structure

```
expo-notification-assignment/
├── frontend/          # React Native Expo application
├── backend/           # Node.js Express server
└── README.md         # This file
```

## Tech Stack

### Frontend
- **React Native** with Expo SDK 52
- **TypeScript** for type safety
- **Expo Notifications** API for push notifications
- **AsyncStorage** for local data persistence
- **Axios** for HTTP requests
- Dark theme UI with custom components

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Firebase Firestore** for database
- **Expo Server SDK** for sending push notifications
- Modularized REST API architecture

## Features

✅ **User Registration** - Register users with push tokens  
✅ **Push Notifications** - Send and receive notifications  
✅ **Backend Status** - Real-time backend connectivity monitoring  
✅ **Dark Theme UI** - Beautiful dark-themed interface  
✅ **Notification Display** - View latest notification in-app  
✅ **Error Handling** - Comprehensive error detection and messages  

## Screenshots

- **Home Screen**: Displays backend status, user info, and send notification button
- **Username Modal**: User registration interface
- **Notification Card**: Shows received notifications with timestamp
- **Status Indicators**: Backend online/offline status with color-coded badges

## Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo Go** app on your mobile device
- **Firebase** project with Firestore enabled
- **ngrok** (for tunneling backend to mobile device)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abhixdd/expo-notification-assignment.git
cd expo-notification-assignment
```

2. **Install root dependencies**
```bash
npm install
```

3. **Setup Backend**
```bash
cd backend
npm install
# Configure .env file (see backend/README.md)
```

4. **Setup Frontend**
```bash
cd frontend
npm install
# Configure .env file (see frontend/README.md)
```

### Running the Application

**Option 1: Run both services together (Recommended)**
```bash
npm run dev
```
This opens two separate terminal windows for backend and frontend.

**Option 2: Run services separately**

Terminal 1 - Backend:
```bash
npm run backend
```

Terminal 2 - Frontend:
```bash
npm run frontend
```

**Option 3: Run with tunnel (for remote testing)**
```bash
cd frontend
npm run tunnel
```

## Documentation

- **[Backend Documentation](./backend/README.md)** - API endpoints, configuration, and examples

## GitHub Repository

**Repository**: [https://github.com/abhixdd/expo-notification-assignment](https://github.com/abhixdd/expo-notification-assignment)

## API Endpoints

Base URL: `http://localhost:3000` (or your ngrok tunnel URL)

### Health Check
```bash
GET /
```

### User Registration
```bash
POST /api/users/register
```

### Send Notification
```bash
POST /api/notifications/send
```

### Get User
```bash
GET /api/users/:userId
```

### Get All Users
```bash
GET /api/users
```

See [Backend README](./backend/README.md) for detailed API documentation with examples.

## Building APK

To build an Android APK:

```bash
cd frontend
eas build --platform android --profile preview
```

**Prerequisites**: EAS CLI account and proper configuration in `app.json` and `eas.json`.

## Environment Variables

### Backend `.env`
```env
PORT=3000
NODE_ENV=development
```

### Frontend `.env`
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/
EXPO_PUBLIC_APP_NAME=Expo Notifications
EXPO_PUBLIC_ENV=development
```

## Testing

### Test Backend Health
```bash
curl http://localhost:3000
```

### Test User Registration
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","expoPushToken":"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"}'
```

### Test Notification
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId":"your-user-id","title":"Test","body":"Hello World!"}'
```


