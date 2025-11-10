import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterOptions {
  status: string[];
  territory: string[];
  lastVisit: string;
  trainingStatus: string[];
}

interface CustomerSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function CustomerSearchFilter({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: CustomerSearchFilterProps) {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const statusOptions = [
    { value: 'active', label: 'Active', color: '#10b981' },
    { value: 'inactive', label: 'Inactive', color: '#ef4444' },
    { value: 'prospect', label: 'Prospect', color: '#f59e0b' },
  ];

  const territoryOptions = [
    { value: 'north', label: 'North Territory' },
    { value: 'south', label: 'South Territory' },
    { value: 'east', label: 'East Territory' },
    { value: 'west', label: 'West Territory' },
  ];

  const lastVisitOptions = [
    { value: '', label: 'Any time' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' },
  ];

  const trainingStatusOptions = [
    { value: 'completed', label: 'Training Completed' },
    { value: 'pending', label: 'Training Pending' },
    { value: 'overdue', label: 'Training Overdue' },
  ];

  const handleStatusToggle = (status: string) => {
    setTempFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleTerritoryToggle = (territory: string) => {
    setTempFilters(prev => ({
      ...prev,
      territory: prev.territory.includes(territory)
        ? prev.territory.filter(t => t !== territory)
        : [...prev.territory, territory],
    }));
  };

  const handleTrainingStatusToggle = (trainingStatus: string) => {
    setTempFilters(prev => ({
      ...prev,
      trainingStatus: prev.trainingStatus.includes(trainingStatus)
        ? prev.trainingStatus.filter(ts => ts !== trainingStatus)
        : [...prev.trainingStatus, trainingStatus],
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      status: [],
      territory: [],
      lastVisit: '',
      trainingStatus: [],
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setFilterModalVisible(false);
  };

  const getActiveFilterCount = () => {
    return (
      filters.status.length +
      filters.territory.length +
      (filters.lastVisit ? 1 : 0) +
      filters.trainingStatus.length
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter-outline" size={20} color="#2563eb" />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter Customers</Text>
            <TouchableOpacity onPress={handleApplyFilters}>
              <Text style={styles.applyButton}>Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Customer Status</Text>
              <View style={styles.filterOptions}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      tempFilters.status.includes(option.value) && styles.filterOptionActive,
                    ]}
                    onPress={() => handleStatusToggle(option.value)}
                  >
                    <View style={[styles.statusIndicator, { backgroundColor: option.color }]} />
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.status.includes(option.value) && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {tempFilters.status.includes(option.value) && (
                      <Ionicons name="checkmark" size={20} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Territory</Text>
              <View style={styles.filterOptions}>
                {territoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      tempFilters.territory.includes(option.value) && styles.filterOptionActive,
                    ]}
                    onPress={() => handleTerritoryToggle(option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.territory.includes(option.value) && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {tempFilters.territory.includes(option.value) && (
                      <Ionicons name="checkmark" size={20} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Last Visit</Text>
              <View style={styles.filterOptions}>
                {lastVisitOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      tempFilters.lastVisit === option.value && styles.filterOptionActive,
                    ]}
                    onPress={() => setTempFilters(prev => ({ ...prev, lastVisit: option.value }))}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.lastVisit === option.value && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {tempFilters.lastVisit === option.value && (
                      <Ionicons name="checkmark" size={20} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Training Status</Text>
              <View style={styles.filterOptions}>
                {trainingStatusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      tempFilters.trainingStatus.includes(option.value) && styles.filterOptionActive,
                    ]}
                    onPress={() => handleTrainingStatusToggle(option.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempFilters.trainingStatus.includes(option.value) && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {tempFilters.trainingStatus.includes(option.value) && (
                      <Ionicons name="checkmark" size={20} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
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
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  applyButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  filterOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterOptionTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clearButton: {
    alignItems: 'center',
    padding: 16,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});