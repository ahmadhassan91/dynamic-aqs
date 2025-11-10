import { DigitalAsset, AssetFilter, AssetUpload, AssetPreview, AssetCategory, AssetStatus } from '@/types/assets';

// Mock data for development
const mockAssets: DigitalAsset[] = [
  {
    id: 'pmac-001',
    fileName: 'pmac-product-image.jpg',
    originalFileName: 'PMAC AirRanger Product Image.jpg',
    fileSize: 156789,
    mimeType: 'image/jpeg',
    s3Key: 'assets/products/pmac-product-image.jpg',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://dynamicaqs.widen.net/content/wvrso6lmpx/jpeg/pmac_button.jpg?crop=true&keep=c&q=80&color=ffffffff&u=bxbsyf&w=280&h=217',
    title: 'AIRRANGER™ Polarized Media Air Cleaner - Product Image',
    description: 'High-quality product image of the PMAC AIRRANGER™ Polarized Media Air Cleaner for marketing and sales materials',
    tags: ['pmac', 'airranger', 'air-cleaner', 'product-image', 'polarized-media'],
    brands: ['Dynamic AQS'],
    category: AssetCategory.PRODUCT_IMAGES,
    targetAudience: ['dealers', 'sales_reps', 'customers', 'marketing'],
    version: '1.0',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'marketing@dynamicaqs.com',
    approvedAt: new Date('2024-01-15'),
    downloadCount: 342,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['dealer_portal', 'website', 'sales_materials', 'pricing_tool'],
    autoDistribute: true,
    createdBy: 'marketing@dynamicaqs.com',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pmac-002',
    fileName: 'pmac-spec-sheet.pdf',
    originalFileName: 'PMAC Specification Sheet DYN 440.pdf',
    fileSize: 1245678,
    mimeType: 'application/pdf',
    s3Key: 'assets/technical/pmac-spec-sheet.pdf',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://dynamicaqs.widen.net/view/pdf/rtf372x4pl/PMAC-Spec-Sheet_DYN_440.pdf?t.download=true&u=bxbsyf',
    title: 'PMAC AIRRANGER™ Specification Sheet',
    description: 'Detailed technical specifications for the PMAC AIRRANGER™ Polarized Media Air Cleaner including installation requirements and performance data',
    tags: ['pmac', 'airranger', 'specification', 'technical', 'installation'],
    brands: ['Dynamic AQS'],
    category: AssetCategory.TECHNICAL,
    targetAudience: ['technicians', 'installers', 'dealers', 'engineers'],
    version: '1.0',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'technical@dynamicaqs.com',
    approvedAt: new Date('2024-01-15'),
    downloadCount: 189,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['dealer_portal', 'technical_library', 'pricing_tool'],
    autoDistribute: true,
    createdBy: 'technical@dynamicaqs.com',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'rs4-001',
    fileName: 'rs4-product-image.jpg',
    originalFileName: 'RS4 Whole House IAQ System Image.jpg',
    fileSize: 198765,
    mimeType: 'image/jpeg',
    s3Key: 'assets/products/rs4-product-image.jpg',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://dynamicaqs.widen.net/content/gxs5ubacor/jpeg/rs4_button.jpg?crop=true&keep=c&q=80&color=ffffffff&u=bxbsyf&w=280&h=217',
    title: 'RS4 Whole House IAQ System - Product Image',
    description: 'Professional product image of the RS4 Whole House Indoor Air Quality System for marketing and sales presentations',
    tags: ['rs4', 'whole-house', 'iaq', 'product-image', 'air-quality'],
    brands: ['Dynamic AQS'],
    category: AssetCategory.PRODUCT_IMAGES,
    targetAudience: ['dealers', 'sales_reps', 'customers', 'marketing'],
    version: '1.0',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'marketing@dynamicaqs.com',
    approvedAt: new Date('2024-01-18'),
    downloadCount: 278,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['dealer_portal', 'website', 'sales_materials', 'pricing_tool'],
    autoDistribute: true,
    createdBy: 'marketing@dynamicaqs.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'rs4-002',
    fileName: 'rs4-spec-sheet.pdf',
    originalFileName: 'RS4 Specification Sheet DYN 481.pdf',
    fileSize: 1567890,
    mimeType: 'application/pdf',
    s3Key: 'assets/technical/rs4-spec-sheet.pdf',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://dynamicaqs.widen.net/view/pdf/epzf9jzqsx/RS4-Spec-Sheet_DYN_481.pdf?t.download=true&u=bxbsyf',
    title: 'RS4 Whole House IAQ System Specification Sheet',
    description: 'Complete technical documentation for the RS4 Whole House IAQ System including multi-stage filtration, UV-C sanitization, and smart controls specifications',
    tags: ['rs4', 'whole-house', 'iaq', 'specification', 'technical', 'uv-c', 'filtration'],
    brands: ['Dynamic AQS'],
    category: AssetCategory.TECHNICAL,
    targetAudience: ['technicians', 'installers', 'dealers', 'engineers'],
    version: '1.0',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'technical@dynamicaqs.com',
    approvedAt: new Date('2024-01-18'),
    downloadCount: 156,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['dealer_portal', 'technical_library', 'pricing_tool'],
    autoDistribute: true,
    createdBy: 'technical@dynamicaqs.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '1',
    fileName: 'product-brochure-2024.pdf',
    originalFileName: 'Dynamic AQS Product Brochure 2024.pdf',
    fileSize: 2048576,
    mimeType: 'application/pdf',
    s3Key: 'assets/marketing/product-brochure-2024.pdf',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://cdn.dynamicaqs.com/assets/marketing/product-brochure-2024.pdf',
    title: 'Dynamic AQS Product Brochure 2024',
    description: 'Comprehensive product overview for residential HVAC systems',
    tags: ['product', 'brochure', '2024', 'residential'],
    brands: ['Dynamic AQS', 'AQS Residential'],
    category: AssetCategory.BROCHURES,
    targetAudience: ['dealers', 'sales_reps', 'customers'],
    version: '1.0',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'marketing@dynamicaqs.com',
    approvedAt: new Date('2024-01-15'),
    downloadCount: 245,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['dealer_portal', 'website', 'sales_materials'],
    autoDistribute: true,
    createdBy: 'marketing@dynamicaqs.com',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    fileName: 'installation-guide-v2.pdf',
    originalFileName: 'Installation Guide v2.1.pdf',
    fileSize: 1536000,
    mimeType: 'application/pdf',
    s3Key: 'assets/technical/installation-guide-v2.pdf',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://cdn.dynamicaqs.com/assets/technical/installation-guide-v2.pdf',
    title: 'Installation Guide v2.1',
    description: 'Step-by-step installation instructions for HVAC systems',
    tags: ['installation', 'technical', 'guide', 'hvac'],
    brands: ['Dynamic AQS'],
    category: AssetCategory.TECHNICAL,
    targetAudience: ['technicians', 'installers', 'dealers'],
    version: '2.1',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'technical@dynamicaqs.com',
    approvedAt: new Date('2024-02-01'),
    downloadCount: 189,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['dealer_portal', 'training_materials'],
    autoDistribute: false,
    createdBy: 'technical@dynamicaqs.com',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    fileName: 'training-presentation.pptx',
    originalFileName: 'Q1 2024 Training Presentation.pptx',
    fileSize: 5242880,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    s3Key: 'assets/training/q1-2024-training.pptx',
    s3Bucket: 'dynamic-aqs-assets',
    cdnUrl: 'https://cdn.dynamicaqs.com/assets/training/q1-2024-training.pptx',
    title: 'Q1 2024 Training Presentation',
    description: 'Quarterly training materials for territory managers',
    tags: ['training', 'q1', '2024', 'presentation'],
    brands: ['Dynamic AQS'],
    category: AssetCategory.TRAINING,
    targetAudience: ['territory_managers', 'regional_managers'],
    version: '1.0',
    isLatestVersion: true,
    status: AssetStatus.PUBLISHED,
    approvedBy: 'training@dynamicaqs.com',
    approvedAt: new Date('2024-03-01'),
    downloadCount: 67,
    lastAccessedAt: new Date(),
    usageAnalytics: [],
    distributionChannels: ['training_portal'],
    autoDistribute: true,
    createdBy: 'training@dynamicaqs.com',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-01')
  }
];

export class AssetService {
  static async getAssets(filter?: AssetFilter): Promise<DigitalAsset[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredAssets = [...mockAssets];
    
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredAssets = filteredAssets.filter(asset =>
          asset.title.toLowerCase().includes(searchLower) ||
          asset.description?.toLowerCase().includes(searchLower) ||
          asset.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (filter.categories?.length) {
        filteredAssets = filteredAssets.filter(asset =>
          filter.categories!.includes(asset.category)
        );
      }
      
      if (filter.brands?.length) {
        filteredAssets = filteredAssets.filter(asset =>
          asset.brands.some(brand => filter.brands!.includes(brand))
        );
      }
      
      if (filter.tags?.length) {
        filteredAssets = filteredAssets.filter(asset =>
          asset.tags.some(tag => filter.tags!.includes(tag))
        );
      }
      
      if (filter.status?.length) {
        filteredAssets = filteredAssets.filter(asset =>
          filter.status!.includes(asset.status)
        );
      }
    }
    
    return filteredAssets;
  }
  
  static async getAssetById(id: string): Promise<DigitalAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAssets.find(asset => asset.id === id) || null;
  }
  
  static async uploadAssets(uploads: AssetUpload[]): Promise<DigitalAsset[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAssets: DigitalAsset[] = uploads.map((upload, index) => ({
      id: `new-${Date.now()}-${index}`,
      fileName: upload.file.name.replace(/\s+/g, '-').toLowerCase(),
      originalFileName: upload.file.name,
      fileSize: upload.file.size,
      mimeType: upload.file.type,
      s3Key: `assets/${upload.category}/${upload.file.name}`,
      s3Bucket: 'dynamic-aqs-assets',
      cdnUrl: `https://cdn.dynamicaqs.com/assets/${upload.category}/${upload.file.name}`,
      title: upload.title,
      description: upload.description,
      tags: upload.tags,
      brands: upload.brands,
      category: upload.category,
      targetAudience: upload.targetAudience,
      version: '1.0',
      isLatestVersion: true,
      status: AssetStatus.DRAFT,
      downloadCount: 0,
      usageAnalytics: [],
      distributionChannels: [],
      autoDistribute: upload.autoDistribute,
      createdBy: 'current-user@dynamicaqs.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    mockAssets.push(...newAssets);
    return newAssets;
  }
  
  static async updateAsset(id: string, updates: Partial<DigitalAsset>): Promise<DigitalAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const assetIndex = mockAssets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) return null;
    
    mockAssets[assetIndex] = {
      ...mockAssets[assetIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return mockAssets[assetIndex];
  }
  
  static async deleteAsset(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const assetIndex = mockAssets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) return false;
    
    mockAssets.splice(assetIndex, 1);
    return true;
  }
  
  static async getAssetPreview(id: string): Promise<AssetPreview | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const asset = mockAssets.find(a => a.id === id);
    if (!asset) return null;
    
    const getPreviewType = (mimeType: string): AssetPreview['type'] => {
      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('video/')) return 'video';
      if (mimeType.startsWith('audio/')) return 'audio';
      return 'document';
    };
    
    return {
      id: asset.id,
      type: getPreviewType(asset.mimeType),
      previewUrl: asset.cdnUrl,
      thumbnailUrl: `${asset.cdnUrl}?thumbnail=true`,
      metadata: {
        dimensions: asset.mimeType.startsWith('image/') ? { width: 1920, height: 1080 } : undefined,
        duration: asset.mimeType.startsWith('video/') ? 120 : undefined,
        pageCount: asset.mimeType === 'application/pdf' ? 15 : undefined
      }
    };
  }
  
  static getBrands(): string[] {
    return ['Dynamic AQS', 'AQS Residential', 'AQS Commercial', 'AQS Industrial'];
  }
  
  static getTargetAudiences(): string[] {
    return [
      'dealers',
      'sales_reps',
      'territory_managers',
      'regional_managers',
      'customers',
      'technicians',
      'installers',
      'engineers',
      'architects'
    ];
  }
}