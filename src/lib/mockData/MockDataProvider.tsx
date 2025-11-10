'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { generateAllMockData } from './generators';
import type {
  MockCustomer,
  MockLead,
  MockTrainingSession,
  MockOrder,
  MockUser,
} from './generators';

interface MockDataContextType {
  users: MockUser[];
  customers: MockCustomer[];
  leads: MockLead[];
  trainingSessions: MockTrainingSession[];
  orders: MockOrder[];
  territories: Array<{ id: string; name: string; regionId: string }>;
  regions: Array<{ id: string; name: string; managerId: string }>;
  affinityGroups: Array<{ id: string; name: string }>;
  ownershipGroups: Array<{ id: string; name: string }>;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

interface MockDataProviderProps {
  children: ReactNode;
}

export function MockDataProvider({ children }: MockDataProviderProps) {
  const mockData = useMemo(() => generateAllMockData(), []);

  return (
    <MockDataContext.Provider value={mockData}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    // Return empty data during SSR or when provider is not available
    return {
      users: [],
      customers: [],
      leads: [],
      trainingSessions: [],
      orders: [],
      territories: [],
      regions: [],
      affinityGroups: [],
      ownershipGroups: [],
    };
  }
  return context;
}

// Utility hooks for specific data types
export function useMockCustomers() {
  const { customers } = useMockData();
  return customers;
}

export function useMockLeads() {
  const { leads } = useMockData();
  return leads;
}

export function useMockTrainingSessions() {
  const { trainingSessions } = useMockData();
  return trainingSessions;
}

export function useMockOrders() {
  const { orders } = useMockData();
  return orders;
}

export function useMockUsers() {
  const { users } = useMockData();
  return users;
}