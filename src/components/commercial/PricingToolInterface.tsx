'use client';

import { useState } from 'react';
import {
    Grid,
    Card,
    Image,
    Text,
    Button,
    Group,
    Stack,
    Badge,
    NumberInput,
    Select,
    Textarea,
    Paper,
    Title,
    Divider,
    ActionIcon,
    Tooltip,
    Alert,
    Modal,
    Table,
    ScrollArea
} from '@mantine/core';
import {
    IconShoppingCart,
    IconDownload,
    IconEye,
    IconPlus,
    IconMinus,
    IconInfoCircle,
    IconCalculator,
    IconFileText
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface Product {
    id: string;
    name: string;
    model: string;
    description: string;
    imageUrl: string;
    specSheetUrl: string;
    basePrice: number;
    category: string;
    features: string[];
    specifications: Record<string, string>;
}

const dynamicAQSProducts: Product[] = [
    {
        id: 'pmac-001',
        name: 'AIRRANGER™ Polarized Media Air Cleaner',
        model: 'PMAC',
        description: 'Advanced polarized media air cleaning technology for superior indoor air quality',
        imageUrl: 'https://dynamicaqs.widen.net/content/wvrso6lmpx/jpeg/pmac_button.jpg?crop=true&keep=c&q=80&color=ffffffff&u=bxbsyf&w=280&h=217',
        specSheetUrl: 'https://dynamicaqs.widen.net/view/pdf/rtf372x4pl/PMAC-Spec-Sheet_DYN_440.pdf?t.download=true&u=bxbsyf',
        basePrice: 1299.99,
        category: 'Air Cleaning',
        features: [
            'Polarized Media Technology',
            'High Efficiency Filtration',
            'Low Maintenance Design',
            'Energy Efficient Operation',
            'Quiet Operation'
        ],
        specifications: {
            'Airflow Range': '800-2000 CFM',
            'Efficiency': '95% @ 0.3 microns',
            'Power Consumption': '45W',
            'Dimensions': '20" x 25" x 6"',
            'Weight': '15 lbs'
        }
    },
    {
        id: 'rs4-001',
        name: 'RS4 Whole House IAQ System',
        model: 'RS4',
        description: 'Comprehensive whole house indoor air quality solution with advanced filtration',
        imageUrl: 'https://dynamicaqs.widen.net/content/gxs5ubacor/jpeg/rs4_button.jpg?crop=true&keep=c&q=80&color=ffffffff&u=bxbsyf&w=280&h=217',
        specSheetUrl: 'https://dynamicaqs.widen.net/view/pdf/epzf9jzqsx/RS4-Spec-Sheet_DYN_481.pdf?t.download=true&u=bxbsyf',
        basePrice: 2499.99,
        category: 'Whole House IAQ',
        features: [
            'Multi-Stage Filtration',
            'UV-C Sanitization',
            'Humidity Control Integration',
            'Smart Controls',
            'Whole House Coverage'
        ],
        specifications: {
            'Coverage Area': 'Up to 3000 sq ft',
            'Filtration Stages': '4-Stage System',
            'UV-C Power': '36W',
            'Control Interface': 'Smart Thermostat Compatible',
            'Installation': 'In-Duct Mount'
        }
    }
];

interface QuoteItem {
    product: Product;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}

export function PricingToolInterface() {
    const [selectedProducts, setSelectedProducts] = useState<QuoteItem[]>([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        company: '',
        email: '',
        phone: ''
    });
    const [quoteNotes, setQuoteNotes] = useState('');
    const [discountType, setDiscountType] = useState<string>('percentage');
    const [globalDiscount, setGlobalDiscount] = useState(0);

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const addToQuote = (product: Product) => {
        const existingItem = selectedProducts.find(item => item.product.id === product.id);

        if (existingItem) {
            setSelectedProducts(prev =>
                prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice * (1 - item.discount / 100) }
                        : item
                )
            );
        } else {
            const newItem: QuoteItem = {
                product,
                quantity: 1,
                unitPrice: product.basePrice,
                discount: 0,
                total: product.basePrice
            };
            setSelectedProducts(prev => [...prev, newItem]);
        }
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            setSelectedProducts(prev => prev.filter(item => item.product.id !== productId));
            return;
        }

        setSelectedProducts(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity, total: quantity * item.unitPrice * (1 - item.discount / 100) }
                    : item
            )
        );
    };

    const updateDiscount = (productId: string, discount: number) => {
        setSelectedProducts(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, discount, total: item.quantity * item.unitPrice * (1 - discount / 100) }
                    : item
            )
        );
    };

    const calculateSubtotal = () => {
        return selectedProducts.reduce((sum, item) => sum + item.total, 0);
    };

    const calculateGlobalDiscountAmount = () => {
        const subtotal = calculateSubtotal();
        return discountType === 'percentage'
            ? subtotal * (globalDiscount / 100)
            : globalDiscount;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateGlobalDiscountAmount();
    };

    const viewProductDetails = (product: Product) => {
        setSelectedProduct(product);
        open();
    };

    const generateQuote = () => {
        // Here you would integrate with the actual pricing system
        console.log('Generating quote with:', {
            products: selectedProducts,
            customer: customerInfo,
            notes: quoteNotes,
            subtotal: calculateSubtotal(),
            discount: calculateGlobalDiscountAmount(),
            total: calculateTotal()
        });

        // Show success message or redirect to quote view
        alert('Quote generated successfully!');
    };

    return (
        <Stack gap="lg">
            {/* Product Catalog */}
            <div>
                <Title order={4} mb="md">Dynamic AQS Product Catalog</Title>
                <Grid>
                    {dynamicAQSProducts.map((product) => (
                        <Grid.Col key={product.id} span={{ base: 12, sm: 6, lg: 4 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                <Card.Section>
                                    <Image
                                        src={product.imageUrl}
                                        height={160}
                                        alt={product.name}
                                        fit="cover"
                                    />
                                </Card.Section>

                                <Stack gap="xs" mt="md">
                                    <Group justify="space-between" align="flex-start">
                                        <div style={{ flex: 1 }}>
                                            <Text fw={500} size="sm" lineClamp={2}>
                                                {product.name}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Model: {product.model}
                                            </Text>
                                        </div>
                                        <Badge color="blue" size="sm">
                                            {product.category}
                                        </Badge>
                                    </Group>

                                    <Text size="xs" c="dimmed" lineClamp={2}>
                                        {product.description}
                                    </Text>

                                    <Group justify="space-between" align="center">
                                        <Text fw={700} size="lg" c="blue">
                                            ${product.basePrice.toLocaleString()}
                                        </Text>
                                        <Group gap="xs">
                                            <Tooltip label="View Details">
                                                <ActionIcon
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() => viewProductDetails(product)}
                                                >
                                                    <IconEye size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Download Spec Sheet">
                                                <ActionIcon
                                                    variant="light"
                                                    size="sm"
                                                    component="a"
                                                    href={product.specSheetUrl}
                                                    target="_blank"
                                                >
                                                    <IconDownload size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Group>

                                    <Button
                                        fullWidth
                                        leftSection={<IconShoppingCart size={16} />}
                                        onClick={() => addToQuote(product)}
                                        variant="light"
                                    >
                                        Add to Quote
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </div>

            {/* Quote Builder */}
            {selectedProducts.length > 0 && (
                <Paper p="lg" withBorder>
                    <Title order={4} mb="md">Quote Builder</Title>

                    <ScrollArea>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Product</Table.Th>
                                    <Table.Th>Quantity</Table.Th>
                                    <Table.Th>Unit Price</Table.Th>
                                    <Table.Th>Discount %</Table.Th>
                                    <Table.Th>Total</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {selectedProducts.map((item) => (
                                    <Table.Tr key={item.product.id}>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Image
                                                    src={item.product.imageUrl}
                                                    width={40}
                                                    height={40}
                                                    radius="sm"
                                                    fit="cover"
                                                />
                                                <div>
                                                    <Text size="sm" fw={500}>
                                                        {item.product.name}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {item.product.model}
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <ActionIcon
                                                    size="sm"
                                                    variant="light"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                >
                                                    <IconMinus size={12} />
                                                </ActionIcon>
                                                <NumberInput
                                                    value={item.quantity}
                                                    onChange={(value) => updateQuantity(item.product.id, Number(value) || 0)}
                                                    min={0}
                                                    size="xs"
                                                    w={60}
                                                    hideControls
                                                />
                                                <ActionIcon
                                                    size="sm"
                                                    variant="light"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                >
                                                    <IconPlus size={12} />
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">${item.unitPrice.toLocaleString()}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <NumberInput
                                                value={item.discount}
                                                onChange={(value) => updateDiscount(item.product.id, Number(value) || 0)}
                                                min={0}
                                                max={100}
                                                size="xs"
                                                w={80}
                                                suffix="%"
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={500}>
                                                ${item.total.toLocaleString()}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="light"
                                                size="sm"
                                                onClick={() => updateQuantity(item.product.id, 0)}
                                            >
                                                <IconMinus size={12} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>

                    <Divider my="md" />

                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="xs">
                                <Text fw={500}>Quote Summary</Text>
                                <Group justify="space-between">
                                    <Text>Subtotal:</Text>
                                    <Text>${calculateSubtotal().toLocaleString()}</Text>
                                </Group>

                                <Group gap="xs">
                                    <Select
                                        value={discountType}
                                        onChange={(value) => setDiscountType(value || 'percentage')}
                                        data={[
                                            { value: 'percentage', label: 'Percentage' },
                                            { value: 'fixed', label: 'Fixed Amount' }
                                        ]}
                                        size="xs"
                                        w={120}
                                    />
                                    <NumberInput
                                        value={globalDiscount}
                                        onChange={(value) => setGlobalDiscount(Number(value) || 0)}
                                        min={0}
                                        size="xs"
                                        w={100}
                                        suffix={discountType === 'percentage' ? '%' : '$'}
                                        label="Global Discount"
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>Discount:</Text>
                                    <Text c="red">-${calculateGlobalDiscountAmount().toLocaleString()}</Text>
                                </Group>

                                <Divider />

                                <Group justify="space-between">
                                    <Text fw={700} size="lg">Total:</Text>
                                    <Text fw={700} size="lg" c="blue">
                                        ${calculateTotal().toLocaleString()}
                                    </Text>
                                </Group>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="xs">
                                <Textarea
                                    label="Quote Notes"
                                    placeholder="Add any special notes or terms for this quote..."
                                    value={quoteNotes}
                                    onChange={(event) => setQuoteNotes(event.currentTarget.value)}
                                    rows={4}
                                />

                                <Group gap="xs" mt="md">
                                    <Button
                                        leftSection={<IconCalculator size={16} />}
                                        onClick={generateQuote}
                                        disabled={selectedProducts.length === 0}
                                    >
                                        Generate Quote
                                    </Button>
                                    <Button variant="outline" leftSection={<IconFileText size={16} />}>
                                        Save Draft
                                    </Button>
                                </Group>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Paper>
            )}

            {/* Product Details Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title={selectedProduct?.name}
                size="lg"
            >
                {selectedProduct && (
                    <Stack gap="md">
                        <Image
                            src={selectedProduct.imageUrl}
                            height={200}
                            fit="contain"
                            radius="md"
                        />

                        <div>
                            <Text fw={500} mb="xs">Description</Text>
                            <Text size="sm" c="dimmed">{selectedProduct.description}</Text>
                        </div>

                        <div>
                            <Text fw={500} mb="xs">Key Features</Text>
                            <Stack gap="xs">
                                {selectedProduct.features.map((feature, index) => (
                                    <Group key={index} gap="xs">
                                        <IconInfoCircle size={16} color="blue" />
                                        <Text size="sm">{feature}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </div>

                        <div>
                            <Text fw={500} mb="xs">Specifications</Text>
                            <Table>
                                <Table.Tbody>
                                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                        <Table.Tr key={key}>
                                            <Table.Td fw={500}>{key}</Table.Td>
                                            <Table.Td>{value}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>

                        <Group gap="xs">
                            <Button
                                leftSection={<IconShoppingCart size={16} />}
                                onClick={() => {
                                    addToQuote(selectedProduct);
                                    close();
                                }}
                            >
                                Add to Quote
                            </Button>
                            <Button
                                variant="outline"
                                leftSection={<IconDownload size={16} />}
                                component="a"
                                href={selectedProduct.specSheetUrl}
                                target="_blank"
                            >
                                Download Spec Sheet
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>

            {selectedProducts.length === 0 && (
                <Alert icon={<IconInfoCircle size={16} />} color="blue">
                    Select products from the catalog above to start building your quote.
                    You can view detailed specifications and download spec sheets for each product.
                </Alert>
            )}
        </Stack>
    );
}