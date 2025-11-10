import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Alert,
    Share,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DigitalAsset {
    id: string;
    title: string;
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    cdnUrl: string;
    description?: string;
    tags: string[];
    brands: string[];
    category: string;
    status: string;
    downloadCount: number;
    createdAt: string;
    updatedAt: string;
}

interface MobileAssetViewerProps {
    asset: DigitalAsset;
    onClose: () => void;
    onShare?: (asset: DigitalAsset) => void;
    onDownload?: (asset: DigitalAsset) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MobileAssetViewer: React.FC<MobileAssetViewerProps> = ({
    asset,
    onClose,
    onShare,
    onDownload
}) => {
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFileIcon = () => {
        if (asset.mimeType.startsWith('image/')) {
            return 'image-outline';
        } else if (asset.mimeType === 'application/pdf') {
            return 'document-text-outline';
        } else if (asset.mimeType.includes('presentation') || asset.mimeType.includes('powerpoint')) {
            return 'easel-outline';
        } else if (asset.mimeType.startsWith('video/')) {
            return 'videocam-outline';
        }
        return 'document-outline';
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this asset: ${asset.title}`,
                url: asset.cdnUrl,
                title: asset.title
            });

            if (result.action === Share.sharedAction) {
                onShare?.(asset);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to share asset');
        }
    };

    const handleDownload = () => {
        Alert.alert(
            'Download Asset',
            `Download ${asset.originalFileName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Download',
                    onPress: () => {
                        setLoading(true);
                        // Simulate download
                        setTimeout(() => {
                            setLoading(false);
                            onDownload?.(asset);
                            Alert.alert('Success', 'Asset downloaded successfully');
                        }, 2000);
                    }
                }
            ]
        );
    };

    const renderPreview = () => {
        if (asset.mimeType.startsWith('image/') && !imageError) {
            return (
                <View style={styles.previewContainer}>
                    <Image
                        source={{ uri: asset.cdnUrl }}
                        style={styles.imagePreview}
                        resizeMode="contain"
                        onError={() => setImageError(true)}
                    />
                </View>
            );
        }

        return (
            <View style={styles.fileIconContainer}>
                <Ionicons
                    name={getFileIcon() as any}
                    size={80}
                    color="#6B7280"
                />
                <Text style={styles.fileTypeText}>
                    {asset.mimeType === 'application/pdf' ? 'PDF Document' :
                        asset.mimeType.includes('presentation') ? 'Presentation' :
                            asset.mimeType.startsWith('video/') ? 'Video File' : 'Document'}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {asset.title}
                </Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                        <Ionicons name="share-outline" size={24} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDownload}
                        style={styles.actionButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#374151" />
                        ) : (
                            <Ionicons name="download-outline" size={24} color="#374151" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Preview */}
                {renderPreview()}

                {/* Asset Information */}
                <View style={styles.infoSection}>
                    <Text style={styles.assetTitle}>{asset.title}</Text>
                    <Text style={styles.fileName}>{asset.originalFileName}</Text>

                    {asset.description && (
                        <Text style={styles.description}>{asset.description}</Text>
                    )}

                    {/* Status Badge */}
                    <View style={styles.statusContainer}>
                        <View style={[
                            styles.statusBadge,
                            asset.status === 'published' ? styles.statusPublished :
                                asset.status === 'approved' ? styles.statusApproved :
                                    asset.status === 'review' ? styles.statusReview :
                                        styles.statusDraft
                        ]}>
                            <Text style={[
                                styles.statusText,
                                asset.status === 'published' ? styles.statusTextPublished :
                                    asset.status === 'approved' ? styles.statusTextApproved :
                                        asset.status === 'review' ? styles.statusTextReview :
                                            styles.statusTextDraft
                            ]}>
                                {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                            </Text>
                        </View>
                    </View>

                    {/* Metadata */}
                    <View style={styles.metadataSection}>
                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>File Size</Text>
                            <Text style={styles.metadataValue}>{formatFileSize(asset.fileSize)}</Text>
                        </View>

                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Category</Text>
                            <Text style={styles.metadataValue}>
                                {asset.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Text>
                        </View>

                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Downloads</Text>
                            <Text style={styles.metadataValue}>{asset.downloadCount}</Text>
                        </View>

                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Created</Text>
                            <Text style={styles.metadataValue}>{formatDate(asset.createdAt)}</Text>
                        </View>

                        <View style={styles.metadataRow}>
                            <Text style={styles.metadataLabel}>Modified</Text>
                            <Text style={styles.metadataValue}>{formatDate(asset.updatedAt)}</Text>
                        </View>
                    </View>

                    {/* Brands */}
                    {asset.brands.length > 0 && (
                        <View style={styles.tagsSection}>
                            <Text style={styles.tagsLabel}>Brands</Text>
                            <View style={styles.tagsContainer}>
                                {asset.brands.map((brand, index) => (
                                    <View key={index} style={[styles.tag, styles.brandTag]}>
                                        <Text style={[styles.tagText, styles.brandTagText]}>{brand}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Tags */}
                    {asset.tags.length > 0 && (
                        <View style={styles.tagsSection}>
                            <Text style={styles.tagsLabel}>Tags</Text>
                            <View style={styles.tagsContainer}>
                                {asset.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF'
    },
    closeButton: {
        padding: 8,
        marginRight: 8
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#111827'
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionButton: {
        padding: 8,
        marginLeft: 8
    },
    content: {
        flex: 1
    },
    previewContainer: {
        height: screenHeight * 0.4,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagePreview: {
        width: screenWidth - 32,
        height: screenHeight * 0.4 - 32,
        borderRadius: 8
    },
    fileIconContainer: {
        height: screenHeight * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB'
    },
    fileTypeText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500'
    },
    infoSection: {
        padding: 16
    },
    assetTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4
    },
    fileName: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12
    },
    description: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 16
    },
    statusContainer: {
        marginBottom: 20
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16
    },
    statusPublished: {
        backgroundColor: '#D1FAE5'
    },
    statusApproved: {
        backgroundColor: '#DBEAFE'
    },
    statusReview: {
        backgroundColor: '#FEF3C7'
    },
    statusDraft: {
        backgroundColor: '#F3F4F6'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600'
    },
    statusTextPublished: {
        color: '#065F46'
    },
    statusTextApproved: {
        color: '#1E40AF'
    },
    statusTextReview: {
        color: '#92400E'
    },
    statusTextDraft: {
        color: '#374151'
    },
    metadataSection: {
        marginBottom: 20
    },
    metadataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    metadataLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500'
    },
    metadataValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600'
    },
    tagsSection: {
        marginBottom: 20
    },
    tagsLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    tag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8
    },
    brandTag: {
        backgroundColor: '#DBEAFE'
    },
    tagText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500'
    },
    brandTagText: {
        color: '#1E40AF'
    }
});