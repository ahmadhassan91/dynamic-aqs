# Dynamic AQS CRM Mobile App

A React Native mobile application for Territory Managers to access customer information, manage routes, and track field activities.

## Features

### Core Functionality
- **Authentication**: Secure login with JWT token storage
- **Offline Support**: SQLite database for offline data storage and synchronization
- **GPS Tracking**: Location services for route planning and visit verification
- **Customer Management**: Search, view, and manage customer information
- **Route Planning**: Optimized daily routes with GPS navigation
- **Data Synchronization**: Automatic sync when online with conflict resolution

### Key Screens
- **Customer List**: Search and browse customers with status indicators
- **Customer Detail**: Complete customer information with quick actions (call, email, directions)
- **Interactive Map**: Customer locations with status-based markers
- **Route Planning**: Daily route optimization with visit tracking
- **Profile & Settings**: User management and app configuration
- **Data Sync**: Manual sync control and pending changes management

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7
- **Database**: Expo SQLite for offline storage
- **Maps**: React Native Maps
- **Location**: Expo Location
- **Storage**: Expo SecureStore for authentication tokens
- **Network**: NetInfo for connectivity detection

## Installation

1. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device/simulator:
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   ```

## Project Structure

```
src/
├── contexts/           # React contexts for global state
│   ├── AuthContext.tsx      # Authentication state management
│   ├── OfflineContext.tsx   # Offline data and sync management
│   └── LocationContext.tsx  # GPS and location services
├── navigation/         # Navigation configuration
│   ├── AuthNavigator.tsx    # Authentication flow navigation
│   └── MainNavigator.tsx    # Main app navigation
├── screens/           # Screen components
│   ├── auth/               # Authentication screens
│   ├── customers/          # Customer management screens
│   ├── map/               # Map and location screens
│   ├── route/             # Route planning screens
│   ├── profile/           # User profile screens
│   └── sync/              # Data synchronization screens
└── components/        # Reusable UI components (future)
```

## Key Features Implementation

### Offline Data Storage
- SQLite database for customer data, activities, and sync queue
- Automatic data synchronization when connectivity is restored
- Conflict resolution for concurrent data changes

### GPS and Location Services
- Real-time location tracking for route optimization
- Customer location mapping with status indicators
- Visit check-in/check-out with location verification

### Authentication
- JWT token-based authentication with secure storage
- Automatic token refresh and session management
- Role-based access control for different user types

### Data Synchronization
- Background sync queue for offline changes
- Visual indicators for sync status and pending changes
- Manual sync controls with progress feedback

## Development Notes

This mobile app is part of the frontend-first development approach for the Dynamic AQS CRM system. It includes:

- Mock data generators for realistic testing scenarios
- Comprehensive offline capabilities for field operations
- Integration points for future backend API connections
- Responsive design for various device sizes

## Future Enhancements

- Voice-to-text note entry with speech recognition
- Camera integration for visit documentation
- Push notifications for important updates
- Advanced route optimization algorithms
- Integration with external mapping services