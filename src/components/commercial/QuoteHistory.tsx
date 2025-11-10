'use client';

import { useState } from 'react';
import {
  Table,
  Group,
  Text,
  Badge,
  Button,
  ActionIcon,
  TextInput,
  Select,
  Stack,
  Paper,
  ScrollArea,
  Menu,
  Modal,
  Card,
  Grid,
  Divider,
  Alert
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconDownload,
  IconEdit,
  IconCopy,
  IconTrash,
  IconDots,
  IconFileText,
  IconCalendar,
  IconUser,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface Quote {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerCompany: string;
  createdDate: string;
  expirationDate: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  totalAmount: number;
  products: Array<{
    name: string;
    model: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes: string;
  createdBy: string;
  lastModified: string;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'Q-2024-001',
    customerName: 'John Smith',
    customerCompany: 'ABC Engineering',
    createdDate: '2024-01-15',
    expirationDate: '2024-02-15',
    status: 'sent',
    totalAmount: 3799.98,
    products: [
      {
        name: 'AIRRANGER™ Polarized Media Air Cleaner',
        model: 'PMAC',
        quantity: 2,
        unitPrice: 1299.99,
        total: 2599.98
      },
      {
        name: 'RS4 Whole House IAQ System',
        model: 'RS4',
        quantity: 1,
        unitPrice: 1200.00,
        total: 1200.00
      }
    ],
    notes: 'Special pricing for bulk order. Installation support included.',
    createdBy: 'Sarah Johnson',
    lastModified: '2024-01-16'
  },
  {
    id: '2',
    quoteNumber: 'Q-2024-002',
    customerName: 'Mike Davis',
    customerCompany: 'Davis HVAC Solutions',
    createdDate: '2024-01-18',
    expirationDate: '2024-02-18',
    status: 'accepted',
    totalAmount: 2499.99,
    products: [
      {
        name: 'RS4 Whole House IAQ System',
        model: 'RS4',
        quantity: 1,
        unitPrice: 2499.99,
        total: 2499.99
      }
    ],
    notes: 'Customer requested expedited delivery.',
    createdBy: 'Tom Wilson',
    lastModified: '2024-01-20'
  },
  {
    id: '3',
    quoteNumber: 'Q-2024-003',
    customerName: 'Lisa Chen',
    customerCompany: 'Green Building Solutions',
    createdDate: '2024-01-22',
    expirationDate: '2024-02-22',
    status: 'draft',
    totalAmount: 5199.96,
    products: [
      {
        name: 'AIRRANGER™ Polarized Media Air Cleaner',
        model: 'PMAC',
        quantity: 4,
        unitPrice: 1299.99,
        total: 5199.96
      }
    ],
    notes: 'Large commercial project - multiple units required.',
    createdBy: 'Sarah Johnson',
    lastModified: '2024-01-22'
  }
];

const statusColors = {
  draft: 'gray',
  sent: 'blue',
  accepted: 'green',
  rejected: 'red',
  expired: 'orange'
};

export function QuoteHistory() {
  const [quotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerCompany.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewQuoteDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    open();
  };

  const duplicateQuote = (quote: Quote) => {
    console.log('Duplicating quote:', quote.quoteNumber);
    // Implementation for duplicating quote
  };

  const downloadQuote = (quote: Quote) => {
    console.log('Downloading quote:', quote.quoteNumber);
    // Implementation for downloading quote as PDF
  };

  const editQuote = (quote: Quote) => {
    console.log('Editing quote:', quote.quoteNumber);
    // Implementation for editing quote
  };

  const deleteQuote = (quote: Quote) => {
    console.log('Deleting quote:', quote.quoteNumber);
    // Implementation for deleting quote
  };

  return (
    <Stack gap="md">
      {/* Filters and Search */}
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={500}>Quote History</Text>
          <Button leftSection={<IconFileText size={16} />}>
            New Quote
          </Button>
        </Group>
        
        <Group gap="md">
          <TextInput
            placeholder="Search quotes..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          
          <Select
            placeholder="Filter by status"
            leftSection={<IconFilter size={16} />}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'all')}
            data={[
              { value: 'all', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'expired', label: 'Expired' }
            ]}
            w={200}
          />
        </Group>
      </Paper>

      {/* Quotes Table */}
      <Paper withBorder>
        <ScrollArea>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Quote #</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Company</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Expires</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredQuotes.map((quote) => (
                <Table.Tr key={quote.id}>
                  <Table.Td>
                    <Text fw={500} c="blue" style={{ cursor: 'pointer' }} onClick={() => viewQuoteDetails(quote)}>
                      {quote.quoteNumber}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{quote.customerName}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{quote.customerCompany}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(quote.createdDate).toLocaleDateString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(quote.expirationDate).toLocaleDateString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[quote.status]} size="sm" variant="light">
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>${quote.totalAmount.toLocaleString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        onClick={() => viewQuoteDetails(quote)}
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                      
                      <ActionIcon
                        variant="light"
                        size="sm"
                        onClick={() => downloadQuote(quote)}
                      >
                        <IconDownload size={14} />
                      </ActionIcon>
                      
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="light" size="sm">
                            <IconDots size={14} />
                          </ActionIcon>
                        </Menu.Target>
                        
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => editQuote(quote)}
                          >
                            Edit Quote
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconCopy size={14} />}
                            onClick={() => duplicateQuote(quote)}
                          >
                            Duplicate
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => deleteQuote(quote)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        
        {filteredQuotes.length === 0 && (
          <Alert icon={<IconFileText size={16} />} color="blue" m="md">
            No quotes found matching your search criteria.
          </Alert>
        )}
      </Paper>

      {/* Quote Details Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedQuote ? `Quote Details - ${selectedQuote.quoteNumber}` : ''}
        size="xl"
      >
        {selectedQuote && (
          <Stack gap="md">
            {/* Quote Header */}
            <Card withBorder>
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text fw={500}>Customer Information</Text>
                    </Group>
                    <Text size="sm">
                      <strong>Name:</strong> {selectedQuote.customerName}
                    </Text>
                    <Text size="sm">
                      <strong>Company:</strong> {selectedQuote.customerCompany}
                    </Text>
                  </Stack>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text fw={500}>Quote Details</Text>
                    </Group>
                    <Text size="sm">
                      <strong>Created:</strong> {new Date(selectedQuote.createdDate).toLocaleDateString()}
                    </Text>
                    <Text size="sm">
                      <strong>Expires:</strong> {new Date(selectedQuote.expirationDate).toLocaleDateString()}
                    </Text>
                    <Text size="sm">
                      <strong>Status:</strong>{' '}
                      <Badge color={statusColors[selectedQuote.status]} size="sm">
                        {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                      </Badge>
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Products */}
            <Card withBorder>
              <Text fw={500} mb="md">Products</Text>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Model</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedQuote.products.map((product, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{product.name}</Table.Td>
                      <Table.Td>{product.model}</Table.Td>
                      <Table.Td>{product.quantity}</Table.Td>
                      <Table.Td>${product.unitPrice.toLocaleString()}</Table.Td>
                      <Table.Td>${product.total.toLocaleString()}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              
              <Divider my="md" />
              
              <Group justify="flex-end">
                <Group gap="xs">
                  <IconCurrencyDollar size={16} />
                  <Text fw={700} size="lg">
                    Total: ${selectedQuote.totalAmount.toLocaleString()}
                  </Text>
                </Group>
              </Group>
            </Card>

            {/* Notes */}
            {selectedQuote.notes && (
              <Card withBorder>
                <Text fw={500} mb="xs">Notes</Text>
                <Text size="sm" c="dimmed">{selectedQuote.notes}</Text>
              </Card>
            )}

            {/* Actions */}
            <Group gap="xs">
              <Button leftSection={<IconDownload size={16} />}>
                Download PDF
              </Button>
              <Button variant="outline" leftSection={<IconEdit size={16} />}>
                Edit Quote
              </Button>
              <Button variant="outline" leftSection={<IconCopy size={16} />}>
                Duplicate
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}