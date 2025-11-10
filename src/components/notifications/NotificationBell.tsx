'use client';

import { useState, useEffect } from 'react';
import { ActionIcon, Indicator, Tooltip } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notificationService } from '@/lib/services/notificationService';
import { NotificationCenter } from './NotificationCenter';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    loadUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleClick = () => {
    open();
    // Refresh unread count when opening
    loadUnreadCount();
  };

  return (
    <>
      <Tooltip label="Notifications">
        <Indicator
          inline
          label={unreadCount > 99 ? '99+' : unreadCount}
          size={16}
          disabled={unreadCount === 0}
          color="red"
        >
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={handleClick}
            aria-label="Open notifications"
          >
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Tooltip>
      
      <NotificationCenter opened={opened} onClose={close} />
    </>
  );
}