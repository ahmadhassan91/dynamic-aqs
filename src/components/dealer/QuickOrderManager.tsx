'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Stack,
  Title,
  Card,
  Text,
  Group,
  Button,
  TextInput,
  NumberInput,
  Table,
  ActionIcon,
  Modal,
  Textarea,
  Select,
  Badge,
  Alert,
  Divider,
  Grid,
  Tabs,
  NumberFormatter,
  Tooltip,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconShoppingCart,
  IconTemplate,
  IconHistory,
  IconSearch,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconDots,
  IconCopy,
  IconStar,
} from '@tabler/icons-react';
import { MockProduct } from '@/lib/mockData/generators';

export interface QuickOrderItem {
  productId: string;
  product: MockProduct;
  quantity: number;
  notes?: string;
}

export interface QuickOrderTemplate {
  id: string;
  name: string;
  description?: string;
  items: QuickOrderItem[];
  createdDate: Date;
  updatedDate: Date;
  useCount: number;
}

export interface PreviousOrder {
  id: string;
  orderNumber: string;
  orderDate: Date;
  items: QuickOrderItem[];
  totalAmount: number;
  status: string;
}

interface QuickOrderManagerProps {
  products: MockProduct[];
  onAddToCart: (items: QuickOrderItem[]) => void;
}

export function QuickOrderManager({ products, onAddToCart }: QuickOrderManagerProps) {
  const [activeTab, setActiveTab] = useState<string | null>('bulk-entry');
  const [quickOrderItems, setQuickOrderItems] = useState<QuickOrderItem[]>([]);
  const [templates, setTemplates] = useState<QuickOrderTemplate[]>([]);
  const [previousOrders, setPreviousOrders] = useState<PreviousOrder[]>([]);
  
  // Modals
  const [templateModalOpened, { open: openTemplateModal, close: closeTemplateModal }] = useDisclosure(false);
  const [editTemplateOpened, { open: openEditTemplate, close: closeEditTemplate }] = useDisclosure(false);
  
  // Form states
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<QuickOrderTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [itemNotes, setItemNotes] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('dealerQuickOrderTemplates');
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates);
        setTemplates(templates.map((template: any) => ({
          ...template,
          createdDate: new Date(template.createdDate),
          updatedDate: new Date(template.updatedDate),
        })));
      } catch {
        setTemplates([]);
      }
    }

    // Mock previous orders data
    const mockPreviousOrders: PreviousOrder[] = [
      {
        id: 'order-1',
        orderNumber: 'ORD-2024-001',
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        items: products.slice(0, 3).map(product => ({
          productId: product.id,
          product,
          quantity: Math.floor(Math.random() * 5) + 1,
        })),
        totalAmount: 2450.00,
        status: 'delivered',
      },
      {
        id: 'order-2',
        orderNumber: 'ORD-2024-002',
        orderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        items: products.slice(2, 5).map(product => ({
          productId: product.id,
          product,
          quantity: Math.floor(Math.random() * 3) + 1,
        })),
        totalAmount: 1890.00,
        status: 'delivered',
      },
    ];
    setPreviousOrders(mockPreviousOrders);
  }, [products]);

  // Filter products for search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products.slice(0, 10); // Show first 10 by default
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20); // Limit to 20 results
  }, [products, searchQuery]);

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItemIndex = quickOrderItems.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...quickOrderItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        notes: itemNotes.trim() || updatedItems[existingItemIndex].notes,
      };
      setQuickOrderItems(updatedItems);
    } else {
      // Add new item
      const newItem: QuickOrderItem = {
        productId: selectedProduct,
        product,
        quantity,
        notes: itemNotes.trim() || undefined,
      };
      setQuickOrderItems([...quickOrderItems, newItem]);
    }

    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setItemNotes('');
  };

  const handleRemoveItem = (productId: string) => {
    setQuickOrderItems(items => items.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setQuickOrderItems(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleClearAll = () => {
    setQuickOrderItems([]);
  };

  const handleAddAllToCart = () => {
    if (quickOrderItems.length === 0) return;
    onAddToCart(quickOrderItems);
    setQuickOrderItems([]);
  };

  const handleSaveAsTemplate = () => {
    if (!templateName.trim() || quickOrderItems.length === 0) return;

    const newTemplate: QuickOrderTemplate = {
      id: `template-${Date.now()}`,
      name: templateName.trim(),
      description: templateDescription.trim() || undefined,
      items: [...quickOrderItems],
      createdDate: new Date(),
      updatedDate: new Date(),
      useCount: 0,
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('dealerQuickOrderTemplates', JSON.stringify(updatedTemplates));

    // Reset form
    setTemplateName('');
    setTemplateDescription('');
    closeTemplateModal();
  };

  const handleLoadTemplate = (template: QuickOrderTemplate) => {
    setQuickOrderItems([...template.items]);
    
    // Update use count
    const updatedTemplates = templates.map(t =>
      t.id === template.id
        ? { ...t, useCount: t.useCount + 1, updatedDate: new Date() }
        : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('dealerQuickOrderTemplates', JSON.stringify(updatedTemplates));
  };

  const handleEditTemplate = (template: QuickOrderTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description || '');
    openEditTemplate();
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !templateName.trim()) return;

    const updatedTemplate: QuickOrderTemplate = {
      ...editingTemplate,
      name: templateName.trim(),
      description: templateDescription.trim() || undefined,
      updatedDate: new Date(),
    };

    const updatedTemplates = templates.map(t =>
      t.id === editingTemplate.id ? updatedTemplate : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('dealerQuickOrderTemplates', JSON.stringify(updatedTemplates));

    // Reset form
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
    closeEditTemplate();
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('dealerQuickOrderTemplates', JSON.stringify(updatedTemplates));
  };

  const handleReorderFromHistory = (order: PreviousOrder) => {
    setQuickOrderItems([...order.items]);
    setActiveTab('bulk-entry');
  };

  const totalAmount = quickOrderItems.reduce((sum, item) => sum + (item.product.dealerPrice * item.quantity), 0);
  const totalItems = quickOrderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Quick Order</Title>
        {quickOrderItems.length > 0 && (
          <Group>
            <Text size="sm" c="dimmed">
              {totalItems} items • <NumberFormatter value={totalAmount} prefix="$" thousandSeparator />
            </Text>
            <Button
              leftSection={<IconShoppingCart size={16} />}
              onClick={handleAddAllToCart}
            >
              Add All to Cart
            </Button>
          </Group>
        )}
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="bulk-entry" leftSection={<IconPlus size={16} />}>
            Bulk Entry
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconTemplate size={16} />}>
            Templates ({templates.length})
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Previous Orders
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bulk-entry">
          <Stack mt="md">
            {/* Add Items Form */}
            <Card withBorder>
              <Stack>
                <Text fw={500}>Add Products</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      placeholder="Search products..."
                      leftSection={<IconSearch size={16} />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      placeholder="Select product"
                      data={filteredProducts.map(product => ({
                        value: product.id,
                        label: `${product.name} - $${product.dealerPrice}`,
                      }))}
                      value={selectedProduct}
                      onChange={setSelectedProduct}
                      searchable
                      clearable
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Quantity"
                      value={quantity}
                      onChange={(value) => setQuantity(Number(value) || 1)}
                      min={1}
                      max={999}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 8 }}>
                    <TextInput
                      label="Notes (optional)"
                      placeholder="Add notes for this item"
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
                <Group justify="flex-end">
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={handleAddItem}
                    disabled={!selectedProduct || quantity <= 0}
                  >
                    Add Item
                  </Button>
                </Group>
              </Stack>
            </Card>

            {/* Quick Order Items */}
            {quickOrderItems.length > 0 && (
              <Card withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>Quick Order Items</Text>
                  <Group>
                    <Button
                      variant="light"
                      leftSection={<IconTemplate size={16} />}
                      onClick={openTemplateModal}
                    >
                      Save as Template
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={handleClearAll}
                    >
                      Clear All
                    </Button>
                  </Group>
                </Group>

                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Product</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Quantity</Table.Th>
                      <Table.Th>Total</Table.Th>
                      <Table.Th>Notes</Table.Th>
                      <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {quickOrderItems.map((item) => (
                      <Table.Tr key={item.productId}>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>
                              {item.product.name}
                            </Text>
                            <Badge size="xs" variant="light">
                              {item.product.category}
                            </Badge>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <NumberFormatter value={item.product.dealerPrice} prefix="$" thousandSeparator />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            value={item.quantity}
                            onChange={(value) => handleUpdateQuantity(item.productId, Number(value) || 0)}
                            min={1}
                            max={999}
                            size="xs"
                            style={{ width: 80 }}
                          />
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
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {item.notes || '-'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Divider my="md" />

                <Group justify="space-between">
                  <Text fw={500}>
                    Total: <NumberFormatter value={totalAmount} prefix="$" thousandSeparator />
                  </Text>
                  <Button
                    leftSection={<IconShoppingCart size={16} />}
                    onClick={handleAddAllToCart}
                  >
                    Add All to Cart
                  </Button>
                </Group>
              </Card>
            )}

            {quickOrderItems.length === 0 && (
              <Alert icon={<IconAlertCircle size={16} />} variant="light">
                No items added yet. Search and select products above to build your quick order.
              </Alert>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="templates">
          <Stack mt="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Save frequently ordered items as templates for quick reordering
              </Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openTemplateModal}
                disabled={quickOrderItems.length === 0}
              >
                Create Template
              </Button>
            </Group>

            {templates.length > 0 ? (
              <Grid>
                {templates.map((template) => (
                  <Grid.Col key={template.id} span={{ base: 12, md: 6 }}>
                    <Card withBorder>
                      <Group justify="space-between" align="flex-start">
                        <div style={{ flex: 1 }}>
                          <Group justify="space-between">
                            <Text fw={500}>{template.name}</Text>
                            <Menu>
                              <Menu.Target>
                                <ActionIcon variant="light">
                                  <IconDots size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<IconEdit size={16} />}
                                  onClick={() => handleEditTemplate(template)}
                                >
                                  Edit Template
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconCopy size={16} />}
                                  onClick={() => handleLoadTemplate(template)}
                                >
                                  Load Template
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<IconTrash size={16} />}
                                  color="red"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  Delete Template
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>

                          {template.description && (
                            <Text size="sm" c="dimmed" mt="xs">
                              {template.description}
                            </Text>
                          )}

                          <Group mt="md" gap="xs">
                            <Badge size="xs" variant="light">
                              {template.items.length} items
                            </Badge>
                            <Badge size="xs" variant="light">
                              Used {template.useCount} times
                            </Badge>
                          </Group>

                          <Text size="xs" c="dimmed" mt="xs">
                            Created {template.createdDate.toLocaleDateString()}
                          </Text>
                        </div>
                      </Group>

                      <Button
                        fullWidth
                        mt="md"
                        leftSection={<IconTemplate size={16} />}
                        onClick={() => handleLoadTemplate(template)}
                      >
                        Load Template
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Alert icon={<IconAlertCircle size={16} />} variant="light">
                No templates created yet. Add items to your quick order and save as a template for future use.
              </Alert>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Stack mt="md">
            <Text size="sm" c="dimmed">
              Quickly reorder from your previous orders
            </Text>

            {previousOrders.length > 0 ? (
              <Stack>
                {previousOrders.map((order) => (
                  <Card key={order.id} withBorder>
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Group justify="space-between">
                          <Text fw={500}>{order.orderNumber}</Text>
                          <Badge color="green" variant="light">
                            {order.status}
                          </Badge>
                        </Group>

                        <Text size="sm" c="dimmed" mt="xs">
                          Ordered on {order.orderDate.toLocaleDateString()}
                        </Text>

                        <Group mt="md" gap="xs">
                          <Badge size="xs" variant="light">
                            {order.items.length} items
                          </Badge>
                          <Badge size="xs" variant="light">
                            <NumberFormatter value={order.totalAmount} prefix="$" thousandSeparator />
                          </Badge>
                        </Group>

                        <Text size="xs" c="dimmed" mt="xs">
                          Items: {order.items.map(item => item.product.name).join(', ')}
                        </Text>
                      </div>
                    </Group>

                    <Button
                      fullWidth
                      mt="md"
                      leftSection={<IconHistory size={16} />}
                      onClick={() => handleReorderFromHistory(order)}
                    >
                      Reorder These Items
                    </Button>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Alert icon={<IconAlertCircle size={16} />} variant="light">
                No previous orders found.
              </Alert>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Save Template Modal */}
      <Modal
        opened={templateModalOpened}
        onClose={closeTemplateModal}
        title="Save as Template"
      >
        <Stack>
          <TextInput
            label="Template Name"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeTemplateModal}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAsTemplate}
              disabled={!templateName.trim() || quickOrderItems.length === 0}
            >
              Save Template
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        opened={editTemplateOpened}
        onClose={closeEditTemplate}
        title="Edit Template"
      >
        <Stack>
          <TextInput
            label="Template Name"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            rows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeEditTemplate}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTemplate}
              disabled={!templateName.trim()}
            >
              Update Template
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}