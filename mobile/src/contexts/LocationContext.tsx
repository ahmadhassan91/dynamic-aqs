import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

interface LocationContextType {
  currentLocation: Location.LocationObject | null;
  isLocationEnabled: boolean;
  locationPermission: Location.PermissionStatus | null;
  requestLocationPermission: () => Promise<boolean>;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => void;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkLocationPermission();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === Location.PermissionStatus.GRANTED) {
        const enabled = await Location.hasServicesEnabledAsync();
        setIsLocationEnabled(enabled);
        
        if (enabled) {
          getCurrentLocation();
        }
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === Location.PermissionStatus.GRANTED) {
        const enabled = await Location.hasServicesEnabledAsync();
        setIsLocationEnabled(enabled);
        return enabled;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      if (locationPermission !== Location.PermissionStatus.GRANTED) {
        const granted = await requestLocationPermission();
        if (!granted) return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation(location);
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  const startLocationTracking = async () => {
    try {
      if (locationPermission !== Location.PermissionStatus.GRANTED) {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }

      if (locationSubscription) {
        locationSubscription.remove();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          setCurrentLocation(location);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const value: LocationContextType = {
    currentLocation,
    isLocationEnabled,
    locationPermission,
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}