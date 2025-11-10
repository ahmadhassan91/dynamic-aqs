import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useOffline } from '../../contexts/OfflineContext';
import CustomerSearchFilter from '../../components/customers/CustomerSearchFilter';

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  lastVisit?: string;
  status: 'active' | 'inactive' | 'prospect';
}

interface FilterOptions {
  status: string[];
  territory: string[];
  lastVisit: string;
  trainingStatus: string[];
}

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    territory: [],
    lastVisit: '',
    trainingStatus: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { isOnline, pendingChanges, syncData } = useOffline();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    // Mock customer data - replace with actual data loading
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Smith',
        company: 'Smith HVAC Services',
        phone: '(555) 123-4567',
        email: 'john@smithhvac.com',
        address: '123 Main St, Anytown, ST 12345',
        lastVisit: '2024-01-15',
        status: 'active',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'Johnson Heating & Cooling',
        phone: '(555) 987-6543',
        email: 'sarah@johnsonhc.com',
        address: '456 Oak Ave, Somewhere, ST 67890',
        lastVisit: '2024-01-10',
        status: 'active',
      },
      {
        id: '3',
        name: 'Mike Wilson',
        company: 'Wilson Air Solutions',
        phone: '(555) 456-7890',
        email: 'mike@wilsonair.com',
        address: '789 Pine Rd, Elsewhere, ST 54321',
        status: 'prospect',
      },
    ];
    setCustomers(mockCustomers);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (isOnline) {
      await syncData();
    }
    await loadCustomers();
    setRefreshing(false);
  };

  const filteredCustomers = customers.filter(customer => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filters.status.length === 0 || 
      filters.status.includes(customer.status);

    // Territory filter (mock - would use actual territory data)
    const matchesTerritory = filters.territory.length === 0 || 
      filters.territory.includes('north'); // Mock territory assignment

    // Last visit filter (mock - would use actual date comparison)
    const matchesLastVisit = filters.lastVisit === '' || 
      (customer.lastVisit && filters.lastVisit === '30');

    // Training status filter (mock - would use actual training data)
    const matchesTrainingStatus = filters.trainingStatus.length === 0 || 
      filters.trainingStatus.includes('completed');

    return matchesSearch && matchesStatus && matchesTerritory && 
           matchesLastVisit && matchesTrainingStatus;
  });

  const renderCustomer = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => navigation.navigate('CustomerDetail' as never, { customerId: item.id } as never)}
    >
      <View style={styles.customerHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerCompany}>{item.company}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        {item.lastVisit && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>Last visit: {item.lastVisit}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'prospect': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <CustomerSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={() => navigation.navigate('Sync' as never)}
        >
          <Ionicons name="sync-outline" size={20} color="#2563eb" />
          {pendingChanges > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingChanges}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'} • {filteredCustomers.length} customers
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  syncButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  customerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerCompany: {
    fontSize: 16,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
});