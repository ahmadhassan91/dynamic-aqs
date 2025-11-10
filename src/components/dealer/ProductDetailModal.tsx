'use client';

import { useState } from 'react';
import {
  Modal,
  Image,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  NumberInput,
  Tabs,
  List,
  Table,
  NumberFormatter,
  Divider,
  Grid,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconInfoCircle,
  IconTool,
  IconShield,
} from '@tabler/icons-react';
import { MockProduct } from '@/lib/mockData/generators';

interface ProductDetailModalProps {
  product: MockProduct | null;
  opened: boolean;
  onClose: () => void;
  onAddToCart: (product: MockProduct, quantity: number) => void;
  cartQuantity?: number;
}

export function ProductDetailModal({
  product,
  opened,
  onClose,
  onAddToCart,
  cartQuantity = 0,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const savingsAmount = product.basePrice - product.dealerPrice;
  const savingsPercent = ((savingsAmount / product.basePrice) * 100).toFixed(0);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={product.name}
      size="xl"
      centered
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            height={300}
            fallbackSrc="/images/placeholder-product.jpg"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            <div>
              <Group justify="space-between" align="flex-start">
                <Badge variant="light">{product.category}</Badge>
                <Badge color={product.inStock ? 'green' : 'red'} variant="light">
                  {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </Badge>
              </Group>

              <Title order={3} mt="md">{product.name}</Title>
              <Text c="dimmed" mt="xs">{product.description}</Text>
            </div>

            <div>
              <Group align="baseline">
                <Text size="xl" fw={700} c="blue">
                  <NumberFormatter value={product.dealerPrice} prefix="$" thousandSeparator />
                </Text>
                <Text size="sm" c="dimmed" td="line-through">
                  <NumberFormatter value={product.basePrice} prefix="$" thousandSeparator />
                </Text>
                <Badge color="green" variant="light">
                  Save {savingsPercent}%
                </Badge>
              </Group>
              <Text size="sm" c="green" fw={500}>
                You save <NumberFormatter value={savingsAmount} prefix="$" thousandSeparator />
              </Text>
            </div>

            {cartQuantity > 0 && (
              <Text size="sm" c="blue">
                Currently in cart: {cartQuantity} items
              </Text>
            )}

            <Group>
              <NumberInput
                label="Quantity"
                value={quantity}
                onChange={(value) => setQuantity(Number(value) || 1)}
                min={1}
                max={product.stockQuantity}
                style={{ flex: 1 }}
                disabled={!product.inStock}
              />
              <Button
                leftSection={<IconShoppingCart size={16} />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                mt="auto"
              >
                Add to Cart
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>

      <Divider my="lg" />

      <Tabs defaultValue="features">
        <Tabs.List>
          <Tabs.Tab value="features" leftSection={<IconInfoCircle size={16} />}>
            Features
          </Tabs.Tab>
          <Tabs.Tab value="specifications" leftSection={<IconTool size={16} />}>
            Specifications
          </Tabs.Tab>
          <Tabs.Tab value="warranty" leftSection={<IconShield size={16} />}>
            Warranty
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="features" pt="md">
          <Title order={4} mb="md">Key Features</Title>
          <List spacing="xs">
            {product.features.map((feature, index) => (
              <List.Item key={index}>{feature}</List.Item>
            ))}
          </List>
        </Tabs.Panel>

        <Tabs.Panel value="specifications" pt="md">
          <Title order={4} mb="md">Technical Specifications</Title>
          <Table>
            <Table.Tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Table.Tr key={key}>
                  <Table.Td fw={500}>{key}</Table.Td>
                  <Table.Td>{value}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>

        <Tabs.Panel value="warranty" pt="md">
          <Title order={4} mb="md">Warranty Information</Title>
          <Stack>
            <Group>
              <Text fw={500}>Warranty Period:</Text>
              <Badge variant="light">{product.warranty}</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              This product is covered by Dynamic AQS&apos;s comprehensive warranty program. 
              Coverage includes parts and labor for manufacturing defects. Installation 
              must be performed by certified technicians to maintain warranty validity.
            </Text>
            <Text size="sm" c="dimmed">
              For warranty claims and support, contact your Territory Manager or 
              call our technical support line at 1-800-DYNAMIC.
            </Text>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}