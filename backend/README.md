# Backend - Node.js Push Notification Server

Express.js backend server for managing push notifications with Firebase Firestore and Expo Server SDK.

## GitHub Repository

**Backend Source Code**: [https://github.com/abhixdd/expo-notification-assignment/tree/master/backend](https://github.com/abhixdd/expo-notification-assignment/tree/master/backend)

## Features

- ✅ **User Registration** - Register users with Expo push tokens
- ✅ **Push Notification Sending** - Send notifications via Expo Push API
- ✅ **Firebase Firestore** - Store user data and tokens
- ✅ **RESTful API** - Modularized route architecture
- ✅ **TypeScript** - Full type safety
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **CORS Enabled** - Cross-origin requests supported

## Tech Stack

- **Node.js** with Express
- **TypeScript** for type safety
- **Firebase Admin SDK** for Firestore
- **Expo Server SDK** for push notifications
- **tsx** for TypeScript execution
- **dotenv** for environment variables

## Installation

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Firebase**

Place your Firebase service account JSON file in the backend directory:

```
backend/firebase-service-account.json
```

Get this file from:
- Firebase Console → Project Settings → Service Accounts → Generate New Private Key

4. **Configure environment variables**

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
```

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Run compiled JavaScript
npm start
```

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### 1. Health Check

Check if server is running.

**Endpoint**

```
GET /
```

**Response**

```json
{
  "status": "ok",
  "message": "Expo Notification Backend is running!",
  "timestamp": "2025-11-08T14:30:00.000Z"
}
```

**cURL Example**

```bash
curl http://localhost:3000/
```

**Postman**
- Method: `GET`
- URL: `http://localhost:3000/`

---

### 2. Register User

Register a new user with their Expo push token.

**Endpoint**

```
POST /api/users/register
```

**Request Body**

```json
{
  "name": "John Doe",
  "expoPushToken": xxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (Success - New User)**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "userId": "abc123xyz789",
    "name": "John Doe",
    "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2025-11-08T14:30:00.000Z"
  }
}
```

**Response (Success - Existing User)**

```json
{
  "status": "success",
  "message": "User already registered",
  "data": {
    "userId": "abc123xyz789",
    "name": "John Doe",
    "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2025-11-08T14:30:00.000Z"
  }
}
```

**Response (Error - Invalid Token)**

```json
{
  "status": "error",
  "message": "Invalid Expo push token format"
}
```

**cURL Example**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
  }'
```

**Postman**
- Method: `POST`
- URL: `http://localhost:3000/api/users/register`
- Headers:
  - `Content-Type`: `application/json`
- Body (raw JSON):
  ```json
  {
    "name": "John Doe",
    "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
  ```

---

### 3. Get User by ID

Retrieve user information by user ID.

**Endpoint**

```
GET /api/users/:userId
```

**Response (Success)**

```json
{
  "status": "success",
  "data": {
    "userId": "abc123xyz789",
    "name": "John Doe",
    "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": {
      "_seconds": 1699454400,
      "_nanoseconds": 0
    }
  }
}
```

**Response (Error - Not Found)**

```json
{
  "status": "error",
  "message": "User not found"
}
```

**cURL Example**

```bash
curl http://localhost:3000/api/users/abc123xyz789
```

**Postman**
- Method: `GET`
- URL: `http://localhost:3000/api/users/abc123xyz789`

---

### 4. Get All Users

Retrieve all registered users (for testing/admin purposes).

**Endpoint**

```
GET /api/users
```

**Response**

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "userId": "abc123xyz789",
        "name": "John Doe",
        "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        "createdAt": {
          "_seconds": 1699454400,
          "_nanoseconds": 0
        }
      },
      {
        "userId": "def456uvw012",
        "name": "Jane Smith",
        "expoPushToken": "[yyyyyyyyyyyyyyyyyyyyyy]",
        "createdAt": {
          "_seconds": 1699454500,
          "_nanoseconds": 0
        }
      }
    ],
    "count": 2
  }
}
```

**cURL Example**

```bash
curl http://localhost:3000/api/users
```

**Postman**
- Method: `GET`
- URL: `http://localhost:3000/api/users`

---

### 5. Send Notification

Send a push notification to a user.

**Endpoint**

```
POST /api/notifications/send
```

**Request Body (with userId)**

```json
{
  "userId": "abc123xyz789",
  "title": "Hello World",
  "body": "This is a test notification!",
  "data": {
    "type": "test",
    "timestamp": "2025-11-08T14:30:00.000Z"
  }
}
```

**Request Body (with expoPushToken directly)**

```json
{
  "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  "title": "Hello World",
  "body": "This is a test notification!",
  "data": {
    "type": "test"
  }
}
```

**Response (Success)**

```json
{
  "status": "success",
  "message": "Notification sent successfully",
  "data": {
    "title": "Hello World",
    "body": "This is a test notification!",
    "sentAt": "2025-11-08T14:30:00.000Z",
    "tickets": [
      {
        "status": "ok",
        "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
      }
    ]
  }
}
```

**Response (Error - User Not Found)**

```json
{
  "status": "error",
  "message": "User not found"
}
```

**Response (Error - Invalid Token)**

```json
{
  "status": "error",
  "message": "Invalid or missing push token"
}
```

**Response (Error - Notification Failed)**

```json
{
  "status": "error",
  "message": "Failed to send notification: DeviceNotRegistered"
}
```

**cURL Example (with userId)**

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123xyz789",
    "title": "Hello World",
    "body": "This is a test notification!",
    "data": {
      "type": "test",
      "timestamp": "2025-11-08T14:30:00.000Z"
    }
  }'
```

**cURL Example (with expoPushToken)**

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "expoPushToken": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "title": "Test Notification",
    "body": "Testing direct token notification"
  }'
```

**Postman**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/send`
- Headers:
  - `Content-Type`: `application/json`
- Body (raw JSON):
  ```json
  {
    "userId": "abc123xyz789",
    "title": "Hello World",
    "body": "This is a test notification!",
    "data": {
      "type": "test"
    }
  }
  ```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── health.ts          # Health check endpoint
│   │   ├── users.ts           # User management endpoints
│   │   └── notifications.ts   # Notification endpoints
│   ├── firebase.ts            # Firebase configuration
│   └── server.ts              # Main server file
├── firebase-service-account.json  # Firebase credentials (gitignored)
├── .env                       # Environment variables (gitignored)
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database

2. **Get Service Account Key**
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-service-account.json` in backend directory

3. **Firestore Collections**

The backend automatically creates:
- `users` collection: Stores user data and push tokens

### Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase (credentials in firebase-service-account.json)
```

## 🧪 Testing with cURL

### Complete Flow Example

1. **Check server is running**

```bash
curl http://localhost:3000/
```

2. **Register a user**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","expoPushToken":"xxxxxxxxxxxxxxxxxxxxxxxxxx"}'
```

3. **Get user ID from response and send notification**

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId":"YOUR_USER_ID","title":"Test","body":"Hello from cURL!"}'
```

4. **Get all users**

```bash
curl http://localhost:3000/api/users
```

## 📊 Testing with Postman

### Import Collection

Create a Postman collection with these requests:

1. **Health Check**
   - GET `http://localhost:3000/`

2. **Register User**
   - POST `http://localhost:3000/api/users/register`
   - Body: `{"name":"Test User","expoPushToken":"[xxx]"}`

3. **Get User**
   - GET `http://localhost:3000/api/users/{{userId}}`

4. **Get All Users**
   - GET `http://localhost:3000/api/users`

5. **Send Notification**
   - POST `http://localhost:3000/api/notifications/send`
   - Body: `{"userId":"{{userId}}","title":"Test","body":"Hello!"}`

### Environment Variables in Postman

Set these variables:
- `baseUrl`: `http://localhost:3000`
- `userId`: (get from register response)
- `pushToken`: `[xxx]`



