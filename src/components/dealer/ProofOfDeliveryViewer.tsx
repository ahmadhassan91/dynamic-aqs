'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Card,
  Group,
  Button,
  Paper,
  Modal,
  Alert,
  Badge,
  Table,
  Image,
  Anchor,
  Divider,
  ActionIcon,
  Tooltip,
  CopyButton,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconFileText,
  IconDownload,
  IconEye,
  IconCopy,
  IconCheck,
  IconAlertTriangle,
  IconMapPin,
  IconClock,
  IconUser,
  IconPhone,
  IconMail,
  IconPackage,
  IconTruck,
  IconCamera,
  IconPrinter,
  IconShare,
  IconRefresh,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  shippingCarrierService,
  type DeliveryConfirmation,
  type CarrierTrackingInfo,
} from '@/lib/services/shippingCarrierService';

interface ProofOfDeliveryViewerProps {
  trackingNumber: string;
  carrier: string;
  orderId?: string;
}

interface DeliveryProof {
  id: string;
  trackingNumber: string;
  orderId?: string;
  carrier: string;
  deliveryConfirmation: DeliveryConfirmation;
  deliveryImages?: string[];
  signatureImage?: string;
  deliveryReceipt?: string;
  additionalDocuments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

// Mock proof of delivery data
const mockProofData: DeliveryProof[] = [
  {
    id: 'pod-001',
    trackingNumber: 'DYN1234567890',
    orderId: 'ORD-2024-001',
    carrier: 'FedEx',
    deliveryConfirmation: {
      deliveredAt: '2024-01-17T14:30:00Z',
      signedBy: 'J. Mitchell',
      deliveryLocation: 'Loading Dock - Rear Entrance',
      recipientName: 'John Mitchell',
      deliveryNotes: 'Package delivered to loading dock as requested. Signature obtained.',
      proofOfDeliveryUrl: '/api/documents/pod-001-receipt.pdf',
      deliveryImageUrl: '/api/documents/pod-001-photo.jpg',
    },
    deliveryImages: [
      '/api/documents/pod-001-photo.jpg',
      '/api/documents/pod-001-location.jpg',
    ],
    signatureImage: '/api/documents/pod-001-signature.png',
    deliveryReceipt: '/api/documents/pod-001-receipt.pdf',
    additionalDocuments: [
      {
        name: 'Bill of Lading',
        url: '/api/documents/pod-001-bol.pdf',
        type: 'PDF',
      },
      {
        name: 'Delivery Instructions',
        url: '/api/documents/pod-001-instructions.pdf',
        type: 'PDF',
      },
    ],
  },
];

export function ProofOfDeliveryViewer({
  trackingNumber,
  carrier,
  orderId,
}: ProofOfDeliveryViewerProps) {
  const [proofData, setProofData] = useState<DeliveryProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [documentModalOpened, { open: openDocumentModal, close: closeDocumentModal }] = useDisclosure(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    fetchProofOfDelivery();
  }, [trackingNumber, carrier]);

  const fetchProofOfDelivery = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the shipping carrier service
      const mockData = mockProofData.find(p => p.trackingNumber === trackingNumber);
      
      if (mockData) {
        setProofData(mockData);
      } else {
        // Try to get delivery confirmation from carrier service
        const deliveryConfirmation = await shippingCarrierService.getDeliveryConfirmation(trackingNumber, carrier);
        if (deliveryConfirmation) {
          setProofData({
            id: `pod-${Date.now()}`,
            trackingNumber,
            orderId,
            carrier,
            deliveryConfirmation,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching proof of delivery:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch proof of delivery information',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    openImageModal();
  };

  const handleViewDocument = (document: { name: string; url: string }) => {
    setSelectedDocument(document);
    openDocumentModal();
  };

  const handleDownload = (url: string, filename: string) => {
    // In a real implementation, this would handle secure document download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    notifications.show({
      title: 'Download Started',
      message: `Downloading ${filename}`,
      color: 'blue',
      icon: <IconDownload size={16} />,
    });
  };

  const handlePrint = () => {
    window.print();
    notifications.show({
      title: 'Print Dialog Opened',
      message: 'Print dialog has been opened',
      color: 'blue',
      icon: <IconPrinter size={16} />,
    });
  };

  const handleShare = async () => {
    if (navigator.share && proofData) {
      try {
        await navigator.share({
          title: `Proof of Delivery - ${proofData.trackingNumber}`,
          text: `Delivery confirmation for tracking number ${proofData.trackingNumber}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        notifications.show({
          title: 'Link Copied',
          message: 'Proof of delivery link copied to clipboard',
          color: 'green',
          icon: <IconCopy size={16} />,
        });
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      notifications.show({
        title: 'Link Copied',
        message: 'Proof of delivery link copied to clipboard',
        color: 'green',
        icon: <IconCopy size={16} />,
      });
    }
  };

  if (loading) {
    return (
      <Container size="md" py="md">
        <Paper p="xl" withBorder style={{ position: 'relative', minHeight: 400 }}>
          <LoadingOverlay visible />
          <Text ta="center">Loading proof of delivery...</Text>
        </Paper>
      </Container>
    );
  }

  if (!proofData) {
    return (
      <Container size="md" py="md">
        <Paper p="xl" withBorder>
          <Stack align="center" gap="md">
            <IconFileText size={48} color="var(--mantine-color-gray-5)" />
            <Text size="lg" fw={600}>No Proof of Delivery Available</Text>
            <Text c="dimmed" ta="center">
              Proof of delivery information is not yet available for this shipment.
              This typically becomes available after the package has been delivered.
            </Text>
            <Button onClick={fetchProofOfDelivery} leftSection={<IconRefresh size={16} />}>
              Check Again
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const { deliveryConfirmation } = proofData;

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Proof of Delivery</Title>
            <Text c="dimmed">
              Delivery confirmation for tracking number {proofData.trackingNumber}
            </Text>
          </div>
          <Group>
            <Button
              variant="outline"
              leftSection={<IconPrinter size={16} />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outline"
              leftSection={<IconShare size={16} />}
              onClick={handleShare}
            >
              Share
            </Button>
          </Group>
        </Group>

        {/* Delivery Summary */}
        <Paper p="lg" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} mb="xs">
                    Delivery Information
                  </Text>
                  <Table>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td fw={500}>Delivered At:</Table.Td>
                        <Table.Td>
                          {new Date(deliveryConfirmation.deliveredAt).toLocaleString()}
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td fw={500}>Signed By:</Table.Td>
                        <Table.Td>{deliveryConfirmation.signedBy}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td fw={500}>Location:</Table.Td>
                        <Table.Td>{deliveryConfirmation.deliveryLocation}</Table.Td>
                      </Table.Tr>
                      {deliveryConfirmation.recipientName && (
                        <Table.Tr>
                          <Table.Td fw={500}>Recipient:</Table.Td>
                          <Table.Td>{deliveryConfirmation.recipientName}</Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} mb="xs">
                    Shipment Details
                  </Text>
                  <Table>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td fw={500}>Tracking Number:</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Text ff="monospace">{proofData.trackingNumber}</Text>
                            <CopyButton value={proofData.trackingNumber}>
                              {({ copied, copy }) => (
                                <ActionIcon size="sm" variant="subtle" onClick={copy}>
                                  <IconCopy size={12} />
                                </ActionIcon>
                              )}
                            </CopyButton>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td fw={500}>Carrier:</Table.Td>
                        <Table.Td>{proofData.carrier}</Table.Td>
                      </Table.Tr>
                      {proofData.orderId && (
                        <Table.Tr>
                          <Table.Td fw={500}>Order ID:</Table.Td>
                          <Table.Td>{proofData.orderId}</Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </div>
              </Stack>
            </Grid.Col>
          </Grid>

          {deliveryConfirmation.deliveryNotes && (
            <>
              <Divider my="md" />
              <div>
                <Text size="sm" c="dimmed" tt="uppercase" fw={600} mb="xs">
                  Delivery Notes
                </Text>
                <Text size="sm">{deliveryConfirmation.deliveryNotes}</Text>
              </div>
            </>
          )}
        </Paper>

        {/* Delivery Images */}
        {proofData.deliveryImages && proofData.deliveryImages.length > 0 && (
          <Paper p="lg" withBorder>
            <Text size="lg" fw={600} mb="md">Delivery Photos</Text>
            <Grid>
              {proofData.deliveryImages.map((imageUrl, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    shadow="sm"
                    padding="xs"
                    radius="md"
                    withBorder
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleViewImage(imageUrl)}
                  >
                    <Card.Section>
                      <Image
                        src={imageUrl}
                        height={200}
                        alt={`Delivery photo ${index + 1}`}
                        fallbackSrc="/placeholder-image.png"
                      />
                    </Card.Section>
                    <Group justify="center" mt="xs">
                      <Button
                        variant="light"
                        size="xs"
                        leftSection={<IconEye size={14} />}
                      >
                        View Full Size
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Signature */}
        {proofData.signatureImage && (
          <Paper p="lg" withBorder>
            <Text size="lg" fw={600} mb="md">Digital Signature</Text>
            <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400 }}>
              <Card.Section>
                <Image
                  src={proofData.signatureImage}
                  height={150}
                  alt="Digital signature"
                  fallbackSrc="/placeholder-signature.png"
                />
              </Card.Section>
              <Text size="sm" c="dimmed" ta="center" mt="xs">
                Signed by: {deliveryConfirmation.signedBy}
              </Text>
            </Card>
          </Paper>
        )}

        {/* Documents */}
        <Paper p="lg" withBorder>
          <Text size="lg" fw={600} mb="md">Delivery Documents</Text>
          <Stack gap="md">
            {/* Delivery Receipt */}
            {proofData.deliveryReceipt && (
              <Group justify="space-between" p="md" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)' }}>
                <Group>
                  <IconFileText size={24} />
                  <div>
                    <Text fw={500}>Delivery Receipt</Text>
                    <Text size="sm" c="dimmed">Official delivery confirmation document</Text>
                  </div>
                </Group>
                <Group>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<IconEye size={14} />}
                    onClick={() => handleViewDocument({ name: 'Delivery Receipt', url: proofData.deliveryReceipt! })}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleDownload(proofData.deliveryReceipt!, 'delivery-receipt.pdf')}
                  >
                    Download
                  </Button>
                </Group>
              </Group>
            )}

            {/* Additional Documents */}
            {proofData.additionalDocuments?.map((document, index) => (
              <Group
                key={index}
                justify="space-between"
                p="md"
                style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)' }}
              >
                <Group>
                  <IconFileText size={24} />
                  <div>
                    <Text fw={500}>{document.name}</Text>
                    <Text size="sm" c="dimmed">{document.type} Document</Text>
                  </div>
                </Group>
                <Group>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<IconEye size={14} />}
                    onClick={() => handleViewDocument(document)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleDownload(document.url, `${document.name.toLowerCase().replace(/\s+/g, '-')}.pdf`)}
                  >
                    Download
                  </Button>
                </Group>
              </Group>
            ))}

            {/* Proof of Delivery URL */}
            {deliveryConfirmation.proofOfDeliveryUrl && (
              <Group justify="space-between" p="md" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)' }}>
                <Group>
                  <IconFileText size={24} />
                  <div>
                    <Text fw={500}>Carrier Proof of Delivery</Text>
                    <Text size="sm" c="dimmed">Official carrier documentation</Text>
                  </div>
                </Group>
                <Group>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<IconEye size={14} />}
                    component="a"
                    href={deliveryConfirmation.proofOfDeliveryUrl}
                    target="_blank"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    leftSection={<IconDownload size={14} />}
                    onClick={() => handleDownload(deliveryConfirmation.proofOfDeliveryUrl!, 'proof-of-delivery.pdf')}
                  >
                    Download
                  </Button>
                </Group>
              </Group>
            )}
          </Stack>
        </Paper>

        {/* Status Badge */}
        <Paper p="md" withBorder>
          <Group justify="center">
            <Badge
              size="xl"
              color="green"
              leftSection={<IconCheck size={16} />}
            >
              Delivery Confirmed
            </Badge>
          </Group>
        </Paper>
      </Stack>

      {/* Image Modal */}
      <Modal
        opened={imageModalOpened}
        onClose={closeImageModal}
        title="Delivery Photo"
        size="lg"
        centered
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Delivery photo"
            fallbackSrc="/placeholder-image.png"
          />
        )}
      </Modal>

      {/* Document Modal */}
      <Modal
        opened={documentModalOpened}
        onClose={closeDocumentModal}
        title={selectedDocument?.name}
        size="xl"
        centered
      >
        {selectedDocument && (
          <iframe
            src={selectedDocument.url}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title={selectedDocument.name}
          />
        )}
      </Modal>
    </Container>
  );
}