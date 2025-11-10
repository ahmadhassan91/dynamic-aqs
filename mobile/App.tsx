import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { OfflineProvider } from './src/contexts/OfflineContext';
import { LocationProvider } from './src/contexts/LocationContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { useAuth } from './src/contexts/AuthContext';
import LoadingScreen from './src/screens/LoadingScreen';

const Stack = createStackNavigator();

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
        <LocationProvider>
          <AppContent />
        </LocationProvider>
      </OfflineProvider>
    </AuthProvider>
  );
}