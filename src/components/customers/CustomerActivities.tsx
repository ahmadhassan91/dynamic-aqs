'use client';

import { useState, useEffect } from 'react';
import { ActivityTimeline } from '@/components/activities/ActivityTimeline';
import { activityService, initializeMockActivities, type Activity } from '@/lib/services/activityService';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import { notifications } from '@mantine/notifications';

interface CustomerActivitiesProps {
  customerId: string;
}

export function CustomerActivities({ customerId }: CustomerActivitiesProps) {
  const { customers } = useMockData();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initialize mock activities if not already done
    const customerIds = customers.map(c => c.id);
    initializeMockActivities(customerIds);
    
    // Get activities for this customer
    const customerActivities = activityService.getCustomerActivities(customerId);
    setActivities(customerActivities);
  }, [customerId, customers]);

  const handleActivityCreate = (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newActivity = activityService.createActivity(activityData);
      setActivities(prev => [newActivity, ...prev]);
      
      notifications.show({
        title: 'Activity Logged',
        message: 'Activity has been successfully logged.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log activity. Please try again.',
        color: 'red',
      });
    }
  };

  const handleActivityUpdate = (id: string, updates: Partial<Activity>) => {
    try {
      const updatedActivity = activityService.updateActivity(id, updates);
      if (updatedActivity) {
        setActivities(prev => 
          prev.map(activity => 
            activity.id === id ? updatedActivity : activity
          )
        );
        
        notifications.show({
          title: 'Activity Updated',
          message: 'Activity has been successfully updated.',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update activity. Please try again.',
        color: 'red',
      });
    }
  };

  const handleActivityDelete = (id: string) => {
    try {
      const success = activityService.deleteActivity(id);
      if (success) {
        setActivities(prev => prev.filter(activity => activity.id !== id));
        
        notifications.show({
          title: 'Activity Deleted',
          message: 'Activity has been successfully deleted.',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete activity. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <ActivityTimeline
      customerId={customerId}
      activities={activities}
      onActivityCreate={handleActivityCreate}
      onActivityUpdate={handleActivityUpdate}
      onActivityDelete={handleActivityDelete}
    />
  );
}