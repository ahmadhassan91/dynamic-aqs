'use client';

import { useState } from 'react';
import {
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  Table,
  Divider,
  NumberFormatter,
  Alert,
  Timeline,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCheck,
  IconPackage,
  IconTruck,
  IconHome,
  IconDownload,
  IconRefresh,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
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
  estimatedDelivery?: Date;
  specialInstructions?: string;
}

interface OrderConfirmationProps {
  order: Order;
  isNewOrder?: boolean;
  onDownloadInvoice: (orderId: string) => void;
  onReorder: (order: Order) => void;
  onContinueShopping: () => void;
  onViewAllOrders: () => void;
}

export function OrderConfirmation({
  order,
  isNewOrder = false,
  onDownloadInvoice,
  onReorder,
  onContinueShopping,
  onViewAllOrders,
}: OrderConfirmationProps) {
  const [emailSent, setEmailSent] = useState(false);

  const handleSendConfirmation = () => {
    // Simulate sending confirmation email
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const getTimelineItems = () => {
    const items = [
      {
        title: 'Order Placed',
        description: `Order ${order.orderNumber} has been received and is being processed`,
        icon: <IconCheck size={16} />,
        color: 'green',
        completed: true,
      },
      {
        title: 'Processing',
        description: 'Your order is being prepared for shipment',
        icon: <IconPackage size={16} />,
        color: 'blue',
        completed: order.status !== 'pending',
      },
      {
        title: 'Shipped',
        description: 'Your order has been shipped and is on its way',
        icon: <IconTruck size={16} />,
        color: 'orange',
        completed: order.status === 'shipped' || order.status === 'delivered',
      },
      {
        title: 'Delivered',
        description: 'Your order has been delivered',
        icon: <IconHome size={16} />,
        color: 'green',
        completed: order.status === 'delivered',
      },
    ];

    return items;
  };

  return (
    <Stack>
      {/* Success Message */}
      {isNewOrder && (
        <Alert icon={<IconCheck size="1rem" />} color="green" mb="lg">
          <Title order={4}>Order Placed Successfully!</Title>
          <Text>
            Thank you for your order. You will receive a confirmation email shortly.
          </Text>
        </Alert>
      )}

      {/* Order Header */}
      <Card withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>Order {order.orderNumber}</Title>
            <Text c="dimmed">Placed on {order.date.toLocaleDateString()}</Text>
            {order.estimatedDelivery && (
              <Text size="sm" mt="xs">
                Estimated delivery: {order.estimatedDelivery.toLocaleDateString()}
              </Text>
            )}
          </div>
          <Badge size="lg" color="green" variant="light">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </Group>
      </Card>

      <Group align="flex-start">
        {/* Order Timeline */}
        <Card withBorder style={{ flex: 1 }}>
          <Title order={4} mb="md">Order Status</Title>
          <Timeline active={getTimelineItems().findIndex(item => !item.completed)}>
            {getTimelineItems().map((item, index) => (
              <Timeline.Item
                key={index}
                bullet={
                  <ThemeIcon
                    size={24}
                    variant={item.completed ? 'filled' : 'light'}
                    color={item.color}
                  >
                    {item.icon}
                  </ThemeIcon>
                }
                title={item.title}
              >
                <Text size="sm" c="dimmed">
                  {item.description}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* Quick Actions */}
        <Card withBorder style={{ minWidth: 250 }}>
          <Title order={4} mb="md">Quick Actions</Title>
          <Stack>
            <Button
              leftSection={<IconDownload size={16} />}
              variant="light"
              fullWidth
              onClick={() => onDownloadInvoice(order.id)}
            >
              Download Invoice
            </Button>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              fullWidth
              onClick={() => onReorder(order)}
            >
              Reorder Items
            </Button>
            <Button
              leftSection={<IconMail size={16} />}
              variant="light"
              fullWidth
              onClick={handleSendConfirmation}
              disabled={emailSent}
            >
              {emailSent ? 'Email Sent!' : 'Email Confirmation'}
            </Button>
            <Divider />
            <Button
              variant="outline"
              fullWidth
              onClick={onContinueShopping}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onViewAllOrders}
            >
              View All Orders
            </Button>
          </Stack>
        </Card>
      </Group>

      {/* Order Details */}
      <Card withBorder>
        <Title order={4} mb="md">Order Details</Title>
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Unit Price</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {order.items.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Text fw={500}>{item.productName}</Text>
                </Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>
                  <NumberFormatter value={item.unitPrice} prefix="$" thousandSeparator />
                </Table.Td>
                <Table.Td>
                  <NumberFormatter value={item.totalPrice} prefix="$" thousandSeparator />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Divider my="md" />

        <Group justify="flex-end">
          <Stack align="flex-end" gap="xs">
            <Group justify="space-between" w={200}>
              <Text>Subtotal:</Text>
              <Text><NumberFormatter value={order.subtotal} prefix="$" thousandSeparator /></Text>
            </Group>
            <Group justify="space-between" w={200}>
              <Text>Tax:</Text>
              <Text><NumberFormatter value={order.tax} prefix="$" thousandSeparator /></Text>
            </Group>
            <Group justify="space-between" w={200}>
              <Text>Shipping:</Text>
              <Text><NumberFormatter value={order.shipping} prefix="$" thousandSeparator /></Text>
            </Group>
            <Divider w={200} />
            <Group justify="space-between" w={200}>
              <Text size="lg" fw={700}>Total:</Text>
              <Text size="lg" fw={700} c="blue">
                <NumberFormatter value={order.total} prefix="$" thousandSeparator />
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* Shipping Information */}
      <Group align="flex-start">
        <Card withBorder style={{ flex: 1 }}>
          <Title order={4} mb="md">Shipping Address</Title>
          <Stack gap="xs">
            <Text fw={500}>{order.shippingAddress.name}</Text>
            {order.shippingAddress.company && (
              <Text>{order.shippingAddress.company}</Text>
            )}
            <Text>{order.shippingAddress.address}</Text>
            <Text>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
          </Stack>
        </Card>

        <Card withBorder style={{ flex: 1 }}>
          <Title order={4} mb="md">Need Help?</Title>
          <Stack gap="sm">
            <Group>
              <IconPhone size={16} />
              <div>
                <Text size="sm" fw={500}>Customer Service</Text>
                <Text size="sm" c="dimmed">1-800-DYNAMIC</Text>
              </div>
            </Group>
            <Group>
              <IconMail size={16} />
              <div>
                <Text size="sm" fw={500}>Email Support</Text>
                <Text size="sm" c="dimmed">support@dynamicaqs.com</Text>
              </div>
            </Group>
            <Text size="xs" c="dimmed">
              For order-specific questions, please reference order number {order.orderNumber}
            </Text>
          </Stack>
        </Card>
      </Group>

      {order.specialInstructions && (
        <Card withBorder>
          <Title order={4} mb="md">Special Instructions</Title>
          <Text size="sm" c="dimmed">{order.specialInstructions}</Text>
        </Card>
      )}
    </Stack>
  );
}