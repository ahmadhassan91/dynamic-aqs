'use client';

import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconBuilding } from '@tabler/icons-react';
import Link from 'next/link';

export function DealerLogo() {
  return (
    <Link href="/dealer" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Group gap="sm">
        <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }}>
          <IconBuilding size={20} />
        </ThemeIcon>
      </Group>
    </Link>
  );
}