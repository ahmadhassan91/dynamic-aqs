'use client';

import { Group, Text, Image } from '@mantine/core';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Group gap="sm">
        <Image
          src="https://www.dynamicaqs.com/images/logo.png?237cdf3c09ae87ebaad1432d027e2ab211f922f0"
          alt="Dynamic AQS"
          height={32}
          width="auto"
          fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32' viewBox='0 0 120 32'%3E%3Crect width='120' height='32' fill='%23228be6'/%3E%3Ctext x='60' y='20' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3EDynamic AQS%3C/text%3E%3C/svg%3E"
        />
        
      </Group>
    </Link>
  );
}