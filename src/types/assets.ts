export interface DigitalAsset {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  
  // Storage information
  s3Key: string;
  s3Bucket: string;
  cdnUrl: string;
  
  // Metadata
  title: string;
  description?: string;
  tags: string[];
  brands: string[]; // Multi-brand support
  category: AssetCategory;
  targetAudience: string[];
  
  // Version control
  version: string;
  parentAssetId?: string; // For versioning
  isLatestVersion: boolean;
  
  // Workflow
  status: AssetStatus;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Usage tracking
  downloadCount: number;
  lastAccessedAt?: Date;
  usageAnalytics: AssetUsageRecord[];
  
  // Distribution
  distributionChannels: string[];
  autoDistribute: boolean;
  
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AssetCategory {
  MARKETING = 'marketing',
  TECHNICAL = 'technical',
  TRAINING = 'training',
  PRODUCT_SHEETS = 'product_sheets',
  PRODUCT_IMAGES = 'product_images',
  BROCHURES = 'brochures',
  PRESENTATIONS = 'presentations',
  VIDEOS = 'videos',
  IMAGES = 'images',
  DOCUMENTS = 'documents'
}

export enum AssetStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface AssetUsageRecord {
  id: string;
  assetId: string;
  userId: string;
  action: AssetAction;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum AssetAction {
  VIEW = 'view',
  DOWNLOAD = 'download',
  SHARE = 'share',
  EDIT = 'edit',
  DELETE = 'delete'
}

export interface AssetFilter {
  search?: string;
  categories?: AssetCategory[];
  brands?: string[];
  tags?: string[];
  status?: AssetStatus[];
  targetAudience?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AssetUpload {
  file: File;
  title: string;
  description?: string;
  tags: string[];
  brands: string[];
  category: AssetCategory;
  targetAudience: string[];
  autoDistribute: boolean;
}

export interface AssetPreview {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  previewUrl?: string;
  thumbnailUrl?: string;
  metadata: {
    dimensions?: { width: number; height: number };
    duration?: number;
    pageCount?: number;
  };
}

export interface AssetFilter {
  categories?: AssetCategory[];
  statuses?: AssetStatus[];
  brands?: string[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}