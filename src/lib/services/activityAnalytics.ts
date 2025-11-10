import type { Activity } from '@/components/activities/ActivityTimeline';

export interface ActivityKPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  target?: number;
  description: string;
}

export interface ActivityInsight {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  recommendation?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ActivityBenchmark {
  metric: string;
  current: number;
  industry: number;
  best: number;
  unit: string;
}

export class ActivityAnalyticsService {
  // Calculate key performance indicators
  static calculateKPIs(
    activities: Activity[], 
    previousPeriodActivities: Activity[] = []
  ): ActivityKPI[] {
    const kpis: ActivityKPI[] = [];

    // Total Activities
    const totalActivities = activities.length;
    const previousTotal = previousPeriodActivities.length;
    const totalTrend = previousTotal > 0 
      ? ((totalActivities - previousTotal) / previousTotal) * 100 
      : 0;

    kpis.push({
      name: 'Total Activities',
      value: totalActivities,
      unit: 'activities',
      trend: totalTrend > 5 ? 'up' : totalTrend < -5 ? 'down' : 'stable',
      trendValue: totalTrend,
      target: Math.ceil(totalActivities * 1.1), // 10% growth target
      description: 'Total number of customer activities recorded',
    });

    // Activity Completion Rate
    const completedActivities = activities.filter(a => 
      a.outcome === 'completed' || a.outcome === 'positive'
    ).length;
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
    
    const previousCompleted = previousPeriodActivities.filter(a => 
      a.outcome === 'completed' || a.outcome === 'positive'
    ).length;
    const previousCompletionRate = previousTotal > 0 ? (previousCompleted / previousTotal) * 100 : 0;
    const completionTrend = completionRate - previousCompletionRate;

    kpis.push({
      name: 'Completion Rate',
      value: completionRate,
      unit: '%',
      trend: completionTrend > 2 ? 'up' : completionTrend < -2 ? 'down' : 'stable',
      trendValue: completionTrend,
      target: 85, // 85% target completion rate
      description: 'Percentage of activities with positive or completed outcomes',
    });

    // Average Response Time (mock calculation based on activity frequency)
    const now = new Date();
    const activitiesWithDuration = activities.filter(a => a.duration && a.duration > 0);
    const avgDuration = activitiesWithDuration.length > 0
      ? activitiesWithDuration.reduce((sum, a) => sum + (a.duration || 0), 0) / activitiesWithDuration.length
      : 0;

    const previousActivitiesWithDuration = previousPeriodActivities.filter(a => a.duration && a.duration > 0);
    const previousAvgDuration = previousActivitiesWithDuration.length > 0
      ? previousActivitiesWithDuration.reduce((sum, a) => sum + (a.duration || 0), 0) / previousActivitiesWithDuration.length
      : 0;
    
    const durationTrend = previousAvgDuration > 0 
      ? ((avgDuration - previousAvgDuration) / previousAvgDuration) * 100 
      : 0;

    kpis.push({
      name: 'Average Duration',
      value: avgDuration,
      unit: 'minutes',
      trend: durationTrend > 10 ? 'up' : durationTrend < -10 ? 'down' : 'stable',
      trendValue: durationTrend,
      target: 45, // 45 minutes target average
      description: 'Average duration of activities with time tracking',
    });

    // Customer Engagement Score
    const uniqueCustomers = new Set(activities.map(a => a.customerId)).size;
    const engagementScore = uniqueCustomers > 0 ? totalActivities / uniqueCustomers : 0;
    
    const previousUniqueCustomers = new Set(previousPeriodActivities.map(a => a.customerId)).size;
    const previousEngagementScore = previousUniqueCustomers > 0 ? previousTotal / previousUniqueCustomers : 0;
    const engagementTrend = previousEngagementScore > 0 
      ? ((engagementScore - previousEngagementScore) / previousEngagementScore) * 100 
      : 0;

    kpis.push({
      name: 'Customer Engagement',
      value: engagementScore,
      unit: 'activities/customer',
      trend: engagementTrend > 5 ? 'up' : engagementTrend < -5 ? 'down' : 'stable',
      trendValue: engagementTrend,
      target: 8, // 8 activities per customer target
      description: 'Average number of activities per unique customer',
    });

    // Follow-up Compliance Rate
    const followUpRequired = activities.filter(a => a.followUpRequired).length;
    const followUpOverdue = activities.filter(a => 
      a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= now
    ).length;
    const followUpCompliance = followUpRequired > 0 
      ? ((followUpRequired - followUpOverdue) / followUpRequired) * 100 
      : 100;

    const previousFollowUpRequired = previousPeriodActivities.filter(a => a.followUpRequired).length;
    const previousFollowUpOverdue = previousPeriodActivities.filter(a => 
      a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= now
    ).length;
    const previousFollowUpCompliance = previousFollowUpRequired > 0 
      ? ((previousFollowUpRequired - previousFollowUpOverdue) / previousFollowUpRequired) * 100 
      : 100;
    const complianceTrend = followUpCompliance - previousFollowUpCompliance;

    kpis.push({
      name: 'Follow-up Compliance',
      value: followUpCompliance,
      unit: '%',
      trend: complianceTrend > 2 ? 'up' : complianceTrend < -2 ? 'down' : 'stable',
      trendValue: complianceTrend,
      target: 95, // 95% compliance target
      description: 'Percentage of follow-ups completed on time',
    });

    return kpis;
  }

  // Generate actionable insights
  static generateInsights(activities: Activity[]): ActivityInsight[] {
    const insights: ActivityInsight[] = [];
    const now = new Date();

    // Check for overdue follow-ups
    const overdueFollowUps = activities.filter(a => 
      a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= now
    );

    if (overdueFollowUps.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Overdue Follow-ups Detected',
        description: `${overdueFollowUps.length} follow-up activities are overdue and require immediate attention.`,
        recommendation: 'Review and complete overdue follow-ups to maintain customer relationships.',
        priority: 'high',
      });
    }

    // Check activity distribution
    const activityTypes = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalActivities = activities.length;
    const callPercentage = ((activityTypes.call || 0) / totalActivities) * 100;
    
    if (callPercentage < 20 && totalActivities > 10) {
      insights.push({
        type: 'info',
        title: 'Low Phone Call Activity',
        description: `Only ${callPercentage.toFixed(1)}% of activities are phone calls. Direct communication might improve customer relationships.`,
        recommendation: 'Consider increasing phone call frequency for better customer engagement.',
        priority: 'medium',
      });
    }

    // Check for inactive customers
    const customerLastActivity = activities.reduce((acc, activity) => {
      const customerId = activity.customerId;
      if (!acc[customerId] || activity.date > acc[customerId]) {
        acc[customerId] = activity.date;
      }
      return acc;
    }, {} as Record<string, Date>);

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const inactiveCustomers = Object.entries(customerLastActivity).filter(
      ([_, lastActivity]) => lastActivity < thirtyDaysAgo
    );

    if (inactiveCustomers.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Inactive Customers Identified',
        description: `${inactiveCustomers.length} customers haven't had any activity in the last 30 days.`,
        recommendation: 'Reach out to inactive customers to maintain engagement and identify opportunities.',
        priority: 'medium',
      });
    }

    // Check completion rates
    const completedActivities = activities.filter(a => 
      a.outcome === 'completed' || a.outcome === 'positive'
    ).length;
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    if (completionRate < 70 && totalActivities > 5) {
      insights.push({
        type: 'error',
        title: 'Low Activity Completion Rate',
        description: `Current completion rate is ${completionRate.toFixed(1)}%, which is below the recommended 70% threshold.`,
        recommendation: 'Review activity processes and provide additional training to improve completion rates.',
        priority: 'high',
      });
    } else if (completionRate > 90) {
      insights.push({
        type: 'success',
        title: 'Excellent Completion Rate',
        description: `Outstanding completion rate of ${completionRate.toFixed(1)}% demonstrates strong execution.`,
        recommendation: 'Continue current practices and consider sharing best practices with other teams.',
        priority: 'low',
      });
    }

    // Check for high-priority activities
    const urgentActivities = activities.filter(a => a.priority === 'urgent').length;
    const highPriorityActivities = activities.filter(a => a.priority === 'high').length;
    const highPriorityPercentage = ((urgentActivities + highPriorityActivities) / totalActivities) * 100;

    if (highPriorityPercentage > 40) {
      insights.push({
        type: 'warning',
        title: 'High Volume of Priority Activities',
        description: `${highPriorityPercentage.toFixed(1)}% of activities are marked as high priority or urgent.`,
        recommendation: 'Review priority assignment criteria and consider workload balancing.',
        priority: 'medium',
      });
    }

    return insights;
  }

  // Compare against industry benchmarks
  static getBenchmarks(activities: Activity[]): ActivityBenchmark[] {
    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => 
      a.outcome === 'completed' || a.outcome === 'positive'
    ).length;
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    const uniqueCustomers = new Set(activities.map(a => a.customerId)).size;
    const activitiesPerCustomer = uniqueCustomers > 0 ? totalActivities / uniqueCustomers : 0;

    const followUpRequired = activities.filter(a => a.followUpRequired).length;
    const followUpOverdue = activities.filter(a => 
      a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= new Date()
    ).length;
    const followUpCompliance = followUpRequired > 0 
      ? ((followUpRequired - followUpOverdue) / followUpRequired) * 100 
      : 100;

    return [
      {
        metric: 'Activity Completion Rate',
        current: completionRate,
        industry: 75, // Industry average
        best: 92, // Best in class
        unit: '%',
      },
      {
        metric: 'Activities per Customer',
        current: activitiesPerCustomer,
        industry: 6.5, // Industry average
        best: 12.3, // Best in class
        unit: 'activities',
      },
      {
        metric: 'Follow-up Compliance',
        current: followUpCompliance,
        industry: 82, // Industry average
        best: 96, // Best in class
        unit: '%',
      },
    ];
  }

  // Calculate activity velocity (activities per time period)
  static calculateVelocity(activities: Activity[], days: number = 30): number {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const recentActivities = activities.filter(a => new Date(a.date) >= cutoffDate);
    return recentActivities.length / days;
  }

  // Predict future activity volume based on trends
  static predictActivityVolume(activities: Activity[], futureDays: number = 30): number {
    if (activities.length < 7) return 0; // Need at least a week of data

    // Calculate daily activity counts for the last 30 days
    const dailyCounts: number[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate >= dayStart && activityDate < dayEnd;
      }).length;
      
      dailyCounts.push(dayActivities);
    }

    // Simple linear trend calculation
    const n = dailyCounts.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices 0 to n-1
    const sumY = dailyCounts.reduce((sum, count) => sum + count, 0);
    const sumXY = dailyCounts.reduce((sum, count, index) => sum + index * count, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict future daily average
    const futureDailyAverage = intercept + slope * (n + futureDays / 2);
    
    return Math.max(0, futureDailyAverage * futureDays);
  }

  // Generate performance score (0-100)
  static calculatePerformanceScore(activities: Activity[]): number {
    if (activities.length === 0) return 0;

    let score = 0;
    let maxScore = 0;

    // Completion rate (30 points max)
    const completedActivities = activities.filter(a => 
      a.outcome === 'completed' || a.outcome === 'positive'
    ).length;
    const completionRate = (completedActivities / activities.length) * 100;
    score += Math.min(30, (completionRate / 100) * 30);
    maxScore += 30;

    // Follow-up compliance (25 points max)
    const followUpRequired = activities.filter(a => a.followUpRequired).length;
    if (followUpRequired > 0) {
      const followUpOverdue = activities.filter(a => 
        a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= new Date()
      ).length;
      const followUpCompliance = ((followUpRequired - followUpOverdue) / followUpRequired) * 100;
      score += Math.min(25, (followUpCompliance / 100) * 25);
    } else {
      score += 25; // Full points if no follow-ups required
    }
    maxScore += 25;

    // Activity diversity (20 points max)
    const activityTypes = new Set(activities.map(a => a.type)).size;
    const diversityScore = Math.min(20, (activityTypes / 6) * 20); // Assuming 6 different types max
    score += diversityScore;
    maxScore += 20;

    // Customer engagement (15 points max)
    const uniqueCustomers = new Set(activities.map(a => a.customerId)).size;
    const engagementRatio = activities.length / uniqueCustomers;
    const engagementScore = Math.min(15, (engagementRatio / 10) * 15); // 10 activities per customer = full points
    score += engagementScore;
    maxScore += 15;

    // Timeliness (10 points max) - based on recent activity
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentActivities = activities.filter(a => new Date(a.date) >= weekAgo).length;
    const timelinessScore = Math.min(10, (recentActivities / activities.length) * 20); // Recent activity bonus
    score += timelinessScore;
    maxScore += 10;

    return Math.round((score / maxScore) * 100);
  }
}