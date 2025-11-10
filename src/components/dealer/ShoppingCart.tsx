'use client';

import { useState } from 'react';
import {
  Card,
  Text,
  Title,
  Group,
  Stack,
  Button,
  ActionIcon,
  Table,
  NumberFormatter,
  Divider,
  TextInput,
  Textarea,
  Select,
  Alert,
  Badge,
} from '@mantine/core';
import {
  IconPlus,
  IconMinus,
  IconX,
  IconShoppingCart,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';
import { MockProduct } from '@/lib/mockData/generators';

interface CartItem {
  product: MockProduct;
  quantity: number;
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (orderData: OrderData) => void;
}

interface OrderData {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialInstructions: string;
  requestedDeliveryDate: string;
}

export function ShoppingCart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: ShoppingCartProps) {
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.dealerPrice * item.quantity), 0);
  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(productId);
    } else {
      onUpdateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    const orderData: OrderData = {
      items: cartItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: shippingInfo,
      specialInstructions,
      requestedDeliveryDate,
    };

    try {
      await onCheckout(orderData);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = () => {
    return shippingInfo.name && 
           shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.state && 
           shippingInfo.zipCode;
  };

  if (cartItems.length === 0) {
    return (
      <Card withBorder>
        <Stack align="center" py="xl">
          <IconShoppingCart size={48} color="gray" />
          <Title order={3} c="dimmed">Your cart is empty</Title>
          <Text c="dimmed" ta="center">
            Browse our product catalog to add items to your cart
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack>
      {/* Cart Items */}
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Shopping Cart ({cartItems.length} items)</Title>
          <Button variant="light" color="red" onClick={onClearCart}>
            Clear Cart
          </Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {cartItems.map((item) => (
              <Table.Tr key={item.product.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{item.product.name}</Text>
                    <Badge size="xs" variant="light">{item.product.category}</Badge>
                    {!item.product.inStock && (
                      <Badge size="xs" color="red" variant="light" mt="xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Table.Td>
                <Table.Td>
                  <NumberFormatter value={item.product.dealerPrice} prefix="$" thousandSeparator />
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      size="sm"
                      variant="light"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    >
                      <IconMinus size={12} />
                    </ActionIcon>
                    <Text fw={500} style={{ minWidth: 30, textAlign: 'center' }}>
                      {item.quantity}
                    </Text>
                    <ActionIcon
                      size="sm"
                      variant="light"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stockQuantity}
                    >
                      <IconPlus size={12} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>
                    <NumberFormatter 
                      value={item.product.dealerPrice * item.quantity} 
                      prefix="$" 
                      thousandSeparator 
                    />
                  </Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Order Summary */}
      <Card withBorder>
        <Title order={4} mb="md">Order Summary</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text>Subtotal:</Text>
            <Text>
              <NumberFormatter value={subtotal} prefix="$" thousandSeparator />
            </Text>
          </Group>
          <Group justify="space-between">
            <Text>Tax ({(taxRate * 100).toFixed(0)}%):</Text>
            <Text>
              <NumberFormatter value={tax} prefix="$" thousandSeparator />
            </Text>
          </Group>
          <Group justify="space-between">
            <Text>Shipping:</Text>
            <Text>
              {shipping === 0 ? (
                <Badge color="green" variant="light">FREE</Badge>
              ) : (
                <NumberFormatter value={shipping} prefix="$" thousandSeparator />
              )}
            </Text>
          </Group>
          <Divider />
          <Group justify="space-between">
            <Text size="lg" fw={700}>Total:</Text>
            <Text size="lg" fw={700} c="blue">
              <NumberFormatter value={total} prefix="$" thousandSeparator />
            </Text>
          </Group>
        </Stack>

        {shipping > 0 && (
          <Alert icon={<IconInfoCircle size="1rem" />} mt="md">
            Add <NumberFormatter value={1000 - subtotal} prefix="$" thousandSeparator /> more to qualify for free shipping!
          </Alert>
        )}
      </Card>

      {/* Shipping Information */}
      <Card withBorder>
        <Title order={4} mb="md">Shipping Information</Title>
        <Stack>
          <Group grow>
            <TextInput
              required
              label="Contact Name"
              placeholder="John Smith"
              value={shippingInfo.name}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextInput
              label="Company Name"
              placeholder="ABC HVAC Solutions"
              value={shippingInfo.company}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, company: e.target.value }))}
            />
          </Group>

          <TextInput
            required
            label="Address"
            placeholder="123 Main Street"
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
          />

          <Group grow>
            <TextInput
              required
              label="City"
              placeholder="Springfield"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
            />
            <Select
              required
              label="State"
              placeholder="Select state"
              data={[
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
              ]}
              value={shippingInfo.state}
              onChange={(value) => setShippingInfo(prev => ({ ...prev, state: value || '' }))}
            />
            <TextInput
              required
              label="ZIP Code"
              placeholder="12345"
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
            />
          </Group>

          <TextInput
            label="Requested Delivery Date"
            type="date"
            value={requestedDeliveryDate}
            onChange={(e) => setRequestedDeliveryDate(e.target.value)}
          />

          <Textarea
            label="Special Instructions"
            placeholder="Any special delivery instructions..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={3}
          />
        </Stack>
      </Card>

      {/* Checkout Button */}
      <Button
        size="lg"
        leftSection={<IconCheck size={20} />}
        onClick={handleCheckout}
        disabled={!isFormValid() || isProcessing}
        loading={isProcessing}
      >
        Place Order
      </Button>
    </Stack>
  );
}