'use client';

import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconBuildingStore } from '@tabler/icons-react';
import Link from 'next/link';

export function CommercialLogo() {
  return (
    <Link href="/commercial" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Group gap="sm">
        <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
          <IconBuildingStore size={20} />
        </ThemeIcon>
      </Group>
    </Link>
  );
}