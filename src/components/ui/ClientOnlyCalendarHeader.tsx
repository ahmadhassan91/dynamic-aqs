'use client';

import { useEffect, useState } from 'react';
import { Group, Title, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface ClientOnlyCalendarHeaderProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function ClientOnlyCalendarHeader({ currentDate, onNavigate }: ClientOnlyCalendarHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Group justify="space-between">
        <Group gap="sm">
          <ActionIcon variant="subtle" disabled>
            <IconChevronLeft size={16} />
          </ActionIcon>
          <Title order={3}>Loading...</Title>
          <ActionIcon variant="subtle" disabled>
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
      </Group>
    );
  }

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'America/New_York',
  });

  return (
    <Group justify="space-between">
      <Group gap="sm">
        <ActionIcon variant="subtle" onClick={() => onNavigate('prev')}>
          <IconChevronLeft size={16} />
        </ActionIcon>
        <Title order={3}>{monthYear}</Title>
        <ActionIcon variant="subtle" onClick={() => onNavigate('next')}>
          <IconChevronRight size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}