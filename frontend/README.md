# Frontend - Expo Push Notification App

React Native application built with Expo for managing push notifications with a beautiful dark-themed UI.

## GitHub Repository

**Frontend Source Code**: [https://github.com/abhixdd/expo-notification-assignment/tree/master/frontend](https://github.com/abhixdd/expo-notification-assignment/tree/master/frontend)

## Features

- ✅ **User Registration** - Username input with push token registration
- ✅ **Push Notifications** - Real-time notification reception
- ✅ **Backend Status Monitoring** - Live backend connectivity check
- ✅ **Dark Theme UI** - Modern dark interface with blue accents
- ✅ **Notification Display** - View latest notification with timestamp
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Offline Detection** - Backend offline warning with retry option

## Screens

### Home Screen

The main screen includes:

1. **App Header** - App name and subtitle
2. **Status Card** - Shows:
   - Backend status (Online/Offline) with color-coded badge
   - Username display
3. **Send Notification Button** - Test button to trigger push notifications
   - Disabled when backend is offline
   - Shows loading state during send
4. **Warning Card** - Appears when backend is offline with retry button
5. **Notification Card** (Optional) - Displays latest received notification:
   - Notification title
   - Notification body/message
   - Timestamp
   - Blue accent border

### Username Modal

- Appears on first launch
- Text input for username
- Validation for empty/invalid names
- Registers user with backend and saves locally

### Notification Log

- Latest notification is displayed on home screen in a card
- Shows title, body, and received timestamp
- Updates automatically when new notification arrives

## Tech Stack

- **React Native** 0.76.9
- **Expo SDK** ~52.0.0
- **TypeScript** for type safety
- **Expo Notifications** API
- **AsyncStorage** for persistence
- **Axios** for HTTP requests

## Installation

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file:

```env
EXPO_PUBLIC_API_URL=https://your-ngrok-url.app
EXPO_PUBLIC_APP_NAME=Expo Notifications
EXPO_PUBLIC_ENV=development
```

**Important**: Update `EXPO_PUBLIC_API_URL` with your backend URL or ngrok tunnel.

## Running the App

### Development Mode (Expo Go)

```bash
npm start
```

Scan the QR code with:
- **Android**: Expo Go app
- **iOS**: Camera app

### Tunnel Mode (Remote Testing)

```bash
npm run tunnel
```

Use this when testing on a device not on the same network.

### Platform Specific

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Building APK

### Prerequisites

1. **Install EAS CLI**

```bash
npm install -g eas-cli
```

2. **Login to Expo**

```bash
eas login
```

3. **Configure EAS Build**

Already configured in `eas.json` and `app.json`.

### Build Commands

**Preview Build (APK)**

```bash
eas build --platform android --profile preview
```

**Development Build (with debugging)**

```bash
eas build --platform android --profile development
```

**Production Build**

```bash
eas build --platform android --profile production
```

### Download APK

After build completes, download from the link provided by EAS CLI.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # UI Components
│   │   ├── StatusCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SendNotificationButton.tsx
│   │   ├── NotificationCard.tsx
│   │   ├── WarningCard.tsx
│   │   ├── UsernameModal.tsx
│   │   └── index.ts
│   ├── hooks/               # Custom Hooks
│   │   ├── useNotifications.ts
│   │   └── useBackendStatus.ts
│   ├── services/            # API Services
│   │   ├── api.service.ts
│   │   └── notification.service.ts
│   ├── config/              # Configuration
│   │   └── constants.ts
│   └── types/               # TypeScript Types
│       └── index.ts
├── assets/                  # Images and icons
├── App.tsx                  # Main app component
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
├── package.json
└── tsconfig.json
```

## Components

### StatusCard

Displays backend status and user information.

**Props:**
- `backendStatus`: 'online' | 'offline' | 'checking'
- `userName`: string

### SendNotificationButton

Button to send test notifications.

**Props:**
- `userId`: string
- `backendStatus`: string

**Features:**
- Disabled when backend offline
- Loading state during API call
- Error handling with alerts

### NotificationCard

Displays received notifications.

**Props:**
- `notification`: Notification object

**Shows:**
- Title
- Body/message
- Timestamp

### StatusBadge

Visual indicator for backend status.

**Props:**
- `status`: 'online' | 'offline' | 'checking'

### WarningCard

Displays when backend is offline.

**Props:**
- `onRetry`: Function to retry connection

### UsernameModal

Modal for user registration.

**Props:**
- `visible`: boolean
- `onConfirm`: (username: string) => void

## Configuration Files

### app.json

Key configurations:
- **EAS Project ID**: `333bfcd2-1401-4b23-9dda-df0cab90b6c4`
- **Package**: `com.expo.notificationassignment`
- **Permissions**: NOTIFICATIONS, INTERNET, ACCESS_NETWORK_STATE
- **Dark splash screen** with background `#111827`
- **Notification plugin** configured

### eas.json

Build profiles:
- **development**: Development build with debugging
- **preview**: APK for testing
- **production**: Production build

## API Integration

The app communicates with the backend using the following endpoints:

### Health Check

```typescript
GET /
```

Checks if backend is online.

### Register User

```typescript
POST /api/users/register
Body: { name: string, expoPushToken: string }
```

Registers user with push token.

### Send Notification

```typescript
POST /api/notifications/send
Body: { userId: string, title: string, body: string }
```

Sends a test notification.

### Get User

```typescript
GET /api/users/:userId
```

Retrieves user information.

## Notification Flow

1. **User launches app** → Requests notification permissions
2. **Permissions granted** → Gets Expo push token
3. **User enters username** → Registers with backend
4. **Registration success** → Token saved to Firestore
5. **User taps "Send Notification"** → Backend sends via Expo API
6. **Notification received** → Displayed in system tray and app

## Debugging

### View Logs (For APK)

**Option 1: ADB Logcat**

```bash
adb logcat | findstr "ReactNativeJS"
```

**Option 2: Development Build**

Build with development profile to see logs in terminal:

```bash
eas build --platform android --profile development
```

### Common Issues

**Push Token Error**
- Check notification permissions in device settings
- Ensure app has INTERNET permission
- Verify EAS project ID in app.json

**Backend Offline**
- Check backend is running on port 3000
- Verify ngrok tunnel is active
- Update .env with correct API URL

**Notifications Not Appearing**
- Check device notification settings
- Ensure push token is valid
- Verify backend sent notification successfully

## Permissions

Android permissions required:
- `NOTIFICATIONS` - Display notifications
- `INTERNET` - Network access
- `ACCESS_NETWORK_STATE` - Check connectivity
- `VIBRATE` - Notification vibration
- `WAKE_LOCK` - Wake device for notifications
- `POST_NOTIFICATIONS` - Android 13+ notification permission

## Environment Variables

```env
# Backend API URL (required)
EXPO_PUBLIC_API_URL=https://your-ngrok-url.app

# App Configuration (optional)
EXPO_PUBLIC_APP_NAME=Expo Notifications
EXPO_PUBLIC_ENV=development
```

**Note**: For APK builds, the .env values are baked into the build. Update and rebuild if API URL changes.

## Testing

### Test on Physical Device (Expo Go)

1. Start backend server
2. Run `npm start`
3. Scan QR code with Expo Go
4. Enter username
5. Tap "Send Test Notification"
6. Check notification in system tray

### Test on APK

1. Build APK with `eas build`
2. Download and install APK
3. Grant notification permissions
4. Enter username
5. Test notifications

## Deployment

### APK Distribution

After building APK, distribute via:
- Direct download link from EAS
- Email or file sharing
- Internal testing channels

### App Store Deployment

For production release:

1. **Build AAB for Play Store**

```bash
eas build --platform android --profile production
```

2. **Submit to Google Play**

```bash
eas submit --platform android
```

## Author

**Abhi**
- GitHub: [@abhixdd](https://github.com/abhixdd)

## License

MIT License - See main repository for details.

## Related

- [Backend Documentation](../backend/README.md)
- [Main Repository README](../README.md)
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
