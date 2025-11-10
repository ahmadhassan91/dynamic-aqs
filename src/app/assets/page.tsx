'use client';

import { Container, Title, Text, Stack } from '@mantine/core';
import { AssetLibrary } from '@/components/assets/AssetLibrary';

export default function AssetsPage() {
  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">Asset Library</Title>
          <Text c="dimmed" size="lg">
            Manage and distribute Dynamic AQS marketing materials, technical documents, and product assets
          </Text>
        </div>

        <AssetLibrary />
      </Stack>
    </Container>
  );
}