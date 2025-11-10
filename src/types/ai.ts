// AI Lead Scoring and Predictive Analytics Types

export interface AILeadScore {
  leadId: string;
  overallScore: number; // 0-100
  conversionProbability: number; // 0-100
  expectedCloseDate: Date | null;
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: Date;
  factors: ScoreFactor[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  engagementScore: number; // 0-100
  behaviorScore: number; // 0-100
  demographicScore: number; // 0-100
  predictedRevenue: number;
  similarLeadsConverted: number;
}

export interface ScoreFactor {
  name: string;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  score: number;
  description: string;
}

export interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  actionable: boolean;
  suggestedActions: string[];
  affectedLeads: string[];
  createdAt: Date;
}

export interface AIAnalytics {
  conversionTrends: ConversionTrend[];
  leadQualityDistribution: QualityDistribution;
  topPerformingSegments: Segment[];
  predictedRevenue: RevenueForecast;
  engagementMetrics: EngagementMetrics;
  churnRisk: ChurnRisk[];
  opportunities: PredictiveInsight[];
}

export interface ConversionTrend {
  period: string;
  predicted: number;
  actual: number;
  confidence: number;
}

export interface QualityDistribution {
  high: number; // Count of high-quality leads
  medium: number;
  low: number;
  percentages: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface Segment {
  name: string;
  conversionRate: number;
  averageValue: number;
  leadCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RevenueForecast {
  currentMonth: number;
  nextMonth: number;
  nextQuarter: number;
  confidence: number;
  factors: string[];
}

export interface EngagementMetrics {
  averageResponseTime: number;
  emailOpenRate: number;
  callConnectRate: number;
  meetingScheduleRate: number;
  overallEngagement: number;
}

export interface ChurnRisk {
  leadId: string;
  leadName: string;
  riskScore: number; // 0-100
  reasons: string[];
  recommendedActions: string[];
}

export interface AIModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: Date;
  samplesProcessed: number;
}
