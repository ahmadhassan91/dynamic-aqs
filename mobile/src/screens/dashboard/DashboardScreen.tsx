import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

  const stats = [
    { label: 'My Customers', value: '125', icon: 'people', color: '#3b82f6' },
    { label: 'This Month Trainings', value: '12', icon: 'school', color: '#10b981' },
    { label: 'Quarter Revenue', value: '$245K', icon: 'trending-up', color: '#f59e0b' },
    { label: 'This Week Activities', value: '15', icon: 'calendar', color: '#8b5cf6' },
  ];

  const recentActivities = [
    { id: '1', customer: 'ABC Supply Co', type: 'Training', date: 'Today', status: 'Completed' },
    { id: '2', customer: 'XYZ Distributors', type: 'Visit', date: 'Today', status: 'Completed' },
    { id: '3', customer: 'Mountain HVAC', type: 'Call', date: 'Yesterday', status: 'Completed' },
    { id: '4', customer: 'Valley Heating', type: 'Training', date: '2 days ago', status: 'Scheduled' },
  ];

  const upcomingTrainings = [
    { id: '1', customer: 'Summit HVAC', date: 'Tomorrow', time: '10:00 AM', type: 'Product Training' },
    { id: '2', customer: 'Peak Distributors', date: 'Dec 2', time: '2:00 PM', type: 'Technical Training' },
    { id: '3', customer: 'Ridge Supply', date: 'Dec 5', time: '9:00 AM', type: 'Sales Training' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Territory Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Sarah Wilson</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={24} color="#3b82f6" />
            <Text style={styles.actionText}>Log Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="school" size={24} color="#10b981" />
            <Text style={styles.actionText}>New Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mic" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Voice Note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="navigate" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>Plan Route</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Trainings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Trainings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {upcomingTrainings.map((training) => (
          <View key={training.id} style={styles.trainingCard}>
            <View style={styles.trainingIcon}>
              <Ionicons name="school" size={20} color="#10b981" />
            </View>
            <View style={styles.trainingInfo}>
              <Text style={styles.trainingCustomer}>{training.customer}</Text>
              <Text style={styles.trainingType}>{training.type}</Text>
              <Text style={styles.trainingTime}>
                {training.date} at {training.time}
              </Text>
            </View>
            <TouchableOpacity style={styles.trainingAction}>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityCustomer}>{activity.customer}</Text>
              <Text style={styles.activityMeta}>
                {activity.type} • {activity.date}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                activity.status === 'Completed' ? styles.statusCompleted : styles.statusScheduled,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  activity.status === 'Completed'
                    ? styles.statusCompletedText
                    : styles.statusScheduledText,
                ]}
              >
                {activity.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* This Month Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Month Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customers Visited</Text>
            <Text style={styles.summaryValue}>45</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trainings Completed</Text>
            <Text style={styles.summaryValue}>12</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phone Calls Made</Text>
            <Text style={styles.summaryValue}>87</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Orders Placed</Text>
            <Text style={styles.summaryValue}>23</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 8,
    textAlign: 'center',
  },
  trainingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trainingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trainingInfo: {
    flex: 1,
  },
  trainingCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  trainingType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  trainingTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  trainingAction: {
    padding: 4,
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityInfo: {
    flex: 1,
  },
  activityCustomer: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusScheduled: {
    backgroundColor: '#dbeafe',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusCompletedText: {
    color: '#059669',
  },
  statusScheduledText: {
    color: '#2563eb',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
});
