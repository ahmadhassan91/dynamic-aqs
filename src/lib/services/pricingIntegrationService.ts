interface RetryOptions {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
    timeoutMs: number;
    enableAutoRetry: boolean;
}

interface IntegrationError {
    id: string;
    integrationId: string;
    timestamp: Date;
    errorType: 'connection' | 'timeout' | 'authentication' | 'data' | 'unknown';
    message: string;
    details: string;
    resolved: boolean;
    resolvedAt?: Date;
    retryCount: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

interface IntegrationLog {
    id: string;
    integrationId: string;
    timestamp: Date;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    details?: any;
    duration?: number;
    operation?: string;
}

interface ConnectionHealth {
    isConnected: boolean;
    responseTime: number;
    lastChecked: Date;
    errorCount: number;
    uptime: number;
}

class PricingIntegrationService {
    private retryOptions: RetryOptions = {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        timeoutMs: 30000,
        enableAutoRetry: true
    };

    private errors: IntegrationError[] = [];
    private logs: IntegrationLog[] = [];
    private healthStatus: Map<string, ConnectionHealth> = new Map();

    // Configuration methods
    updateRetryConfiguration(options: Partial<RetryOptions>): void {
        this.retryOptions = { ...this.retryOptions, ...options };
        this.log('pricing-config', 'info', 'Retry configuration updated', options);
    }

    getRetryConfiguration(): RetryOptions {
        return { ...this.retryOptions };
    }

    // Error handling and retry logic
    async executeWithRetry<T>(
        operation: () => Promise<T>,
        integrationId: string,
        operationName: string
    ): Promise<T> {
        let lastError: Error | null = null;
        let retryCount = 0;

        while (retryCount <= this.retryOptions.maxRetries) {
            try {
                const startTime = Date.now();
                
                // Set timeout for the operation
                const result = await Promise.race([
                    operation(),
                    this.createTimeoutPromise<T>(this.retryOptions.timeoutMs)
                ]) as T;

                const duration = Date.now() - startTime;
                
                // Log successful operation
                this.log(integrationId, 'info', `${operationName} completed successfully`, {
                    duration,
                    retryCount
                });

                // Update health status
                this.updateHealthStatus(integrationId, true, duration);

                return result;
            } catch (error) {
                lastError = error as Error;
                retryCount++;

                // Log the error
                this.logError(integrationId, error as Error, operationName, retryCount);

                // Update health status
                this.updateHealthStatus(integrationId, false, 0);

                // If we've exhausted retries, throw the error
                if (retryCount > this.retryOptions.maxRetries) {
                    break;
                }

                // Calculate delay with exponential backoff
                const delay = this.retryOptions.retryDelay * 
                    Math.pow(this.retryOptions.backoffMultiplier, retryCount - 1);

                this.log(integrationId, 'warn', `Retrying ${operationName} in ${delay}ms`, {
                    retryCount,
                    maxRetries: this.retryOptions.maxRetries,
                    delay
                });

                // Wait before retrying
                await this.delay(delay);
            }
        }

        // Create and store integration error
        const integrationError = this.createIntegrationError(
            integrationId,
            lastError!,
            operationName,
            retryCount
        );
        this.errors.push(integrationError);

        throw lastError;
    }

    // Database connection methods
    async testDatabaseConnection(connectionConfig: any): Promise<ConnectionHealth> {
        const integrationId = 'pricing-mysql';
        
        return this.executeWithRetry(async () => {
            // Mock database connection test
            const startTime = Date.now();
            
            // Simulate connection attempt
            await this.delay(Math.random() * 100 + 20);
            
            // Simulate occasional failures for testing
            if (Math.random() < 0.1) {
                throw new Error('Connection refused by database server');
            }

            const responseTime = Date.now() - startTime;
            
            return {
                isConnected: true,
                responseTime,
                lastChecked: new Date(),
                errorCount: 0,
                uptime: 99.5
            };
        }, integrationId, 'Database Connection Test');
    }

    async executeDatabaseQuery(query: string, params?: any[]): Promise<any> {
        const integrationId = 'pricing-mysql';
        
        return this.executeWithRetry(async () => {
            // Mock database query execution
            await this.delay(Math.random() * 50 + 10);
            
            // Simulate query failures
            if (Math.random() < 0.05) {
                throw new Error(`Query execution failed: ${query.substring(0, 50)}...`);
            }

            // Return mock data based on query type
            if (query.toLowerCase().includes('select')) {
                return { rows: [], rowCount: 0 };
            } else {
                return { affectedRows: 1 };
            }
        }, integrationId, 'Database Query');
    }

    // API connection methods
    async testApiConnection(apiConfig: any): Promise<ConnectionHealth> {
        const integrationId = 'pricing-api';
        
        return this.executeWithRetry(async () => {
            const startTime = Date.now();
            
            // Simulate API health check
            await this.delay(Math.random() * 200 + 50);
            
            // Simulate API failures
            if (Math.random() < 0.15) {
                throw new Error('API endpoint not responding');
            }

            const responseTime = Date.now() - startTime;
            
            return {
                isConnected: true,
                responseTime,
                lastChecked: new Date(),
                errorCount: 0,
                uptime: 97.8
            };
        }, integrationId, 'API Connection Test');
    }

    async makeApiRequest(endpoint: string, options: any = {}): Promise<any> {
        const integrationId = 'pricing-api';
        
        return this.executeWithRetry(async () => {
            // Mock API request
            await this.delay(Math.random() * 300 + 100);
            
            // Simulate various API errors
            const errorChance = Math.random();
            if (errorChance < 0.02) {
                throw new Error('API rate limit exceeded');
            } else if (errorChance < 0.05) {
                throw new Error('Authentication token expired');
            } else if (errorChance < 0.08) {
                throw new Error('Internal server error');
            }

            // Return mock response
            return {
                status: 200,
                data: { message: 'Success', timestamp: new Date().toISOString() }
            };
        }, integrationId, `API Request: ${endpoint}`);
    }

    // Quote synchronization methods
    async syncQuotes(batchSize: number = 50): Promise<void> {
        const integrationId = 'quote-sync';
        
        return this.executeWithRetry(async () => {
            // Mock quote synchronization
            await this.delay(Math.random() * 1000 + 500);
            
            // Simulate sync failures
            if (Math.random() < 0.12) {
                throw new Error('Quote synchronization failed: database lock timeout');
            }

            this.log(integrationId, 'info', `Synchronized ${batchSize} quotes successfully`);
        }, integrationId, 'Quote Synchronization');
    }

    // Health monitoring methods
    async checkAllIntegrations(): Promise<Map<string, ConnectionHealth>> {
        const results = new Map<string, ConnectionHealth>();

        try {
            // Test database connection
            const dbHealth = await this.testDatabaseConnection({});
            results.set('pricing-mysql', dbHealth);
        } catch (error) {
            results.set('pricing-mysql', {
                isConnected: false,
                responseTime: 0,
                lastChecked: new Date(),
                errorCount: this.getErrorCount('pricing-mysql'),
                uptime: 0
            });
        }

        try {
            // Test API connection
            const apiHealth = await this.testApiConnection({});
            results.set('pricing-api', apiHealth);
        } catch (error) {
            results.set('pricing-api', {
                isConnected: false,
                responseTime: 0,
                lastChecked: new Date(),
                errorCount: this.getErrorCount('pricing-api'),
                uptime: 0
            });
        }

        try {
            // Test sync service
            await this.syncQuotes(1); // Test with single quote
            results.set('quote-sync', {
                isConnected: true,
                responseTime: 100,
                lastChecked: new Date(),
                errorCount: this.getErrorCount('quote-sync'),
                uptime: 95.2
            });
        } catch (error) {
            results.set('quote-sync', {
                isConnected: false,
                responseTime: 0,
                lastChecked: new Date(),
                errorCount: this.getErrorCount('quote-sync'),
                uptime: 0
            });
        }

        this.healthStatus = results;
        return results;
    }

    // Error management methods
    getErrors(integrationId?: string): IntegrationError[] {
        if (integrationId) {
            return this.errors.filter(error => error.integrationId === integrationId);
        }
        return [...this.errors];
    }

    getUnresolvedErrors(integrationId?: string): IntegrationError[] {
        return this.getErrors(integrationId).filter(error => !error.resolved);
    }

    resolveError(errorId: string): boolean {
        const error = this.errors.find(e => e.id === errorId);
        if (error && !error.resolved) {
            error.resolved = true;
            error.resolvedAt = new Date();
            
            this.log(error.integrationId, 'info', `Error resolved: ${error.message}`, {
                errorId,
                resolvedAt: error.resolvedAt
            });
            
            return true;
        }
        return false;
    }

    // Logging methods
    getLogs(integrationId?: string, level?: string): IntegrationLog[] {
        let filteredLogs = [...this.logs];
        
        if (integrationId) {
            filteredLogs = filteredLogs.filter(log => log.integrationId === integrationId);
        }
        
        if (level) {
            filteredLogs = filteredLogs.filter(log => log.level === level);
        }
        
        return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    exportLogs(format: 'json' | 'csv' = 'json'): string {
        const logs = this.getLogs();
        
        if (format === 'csv') {
            const headers = ['Timestamp', 'Integration', 'Level', 'Message', 'Operation', 'Duration'];
            const rows = logs.map(log => [
                log.timestamp.toISOString(),
                log.integrationId,
                log.level,
                log.message,
                log.operation || '',
                log.duration?.toString() || ''
            ]);
            
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        return JSON.stringify(logs, null, 2);
    }

    clearLogs(olderThanDays: number = 30): number {
        const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
        const initialCount = this.logs.length;
        
        this.logs = this.logs.filter(log => log.timestamp > cutoffDate);
        
        const removedCount = initialCount - this.logs.length;
        this.log('system', 'info', `Cleared ${removedCount} old log entries`);
        
        return removedCount;
    }

    // Private helper methods
    private createTimeoutPromise<T>(timeoutMs: number): Promise<T> {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private log(
        integrationId: string, 
        level: 'info' | 'warn' | 'error' | 'debug', 
        message: string, 
        details?: any,
        operation?: string,
        duration?: number
    ): void {
        const logEntry: IntegrationLog = {
            id: this.generateId(),
            integrationId,
            timestamp: new Date(),
            level,
            message,
            details,
            operation,
            duration
        };

        this.logs.push(logEntry);

        // Keep only last 1000 log entries to prevent memory issues
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(-1000);
        }

        // Also log to console for debugging
        console.log(`[${level.toUpperCase()}] ${integrationId}: ${message}`, details);
    }

    private logError(
        integrationId: string, 
        error: Error, 
        operation: string, 
        retryCount: number
    ): void {
        this.log(integrationId, 'error', error.message, {
            operation,
            retryCount,
            stack: error.stack
        }, operation);
    }

    private createIntegrationError(
        integrationId: string,
        error: Error,
        operation: string,
        retryCount: number
    ): IntegrationError {
        const errorType = this.categorizeError(error);
        const severity = this.determineSeverity(error, retryCount);

        return {
            id: this.generateId(),
            integrationId,
            timestamp: new Date(),
            errorType,
            message: error.message,
            details: error.stack || error.toString(),
            resolved: false,
            retryCount,
            severity
        };
    }

    private categorizeError(error: Error): IntegrationError['errorType'] {
        const message = error.message.toLowerCase();
        
        if (message.includes('timeout') || message.includes('timed out')) {
            return 'timeout';
        } else if (message.includes('connection') || message.includes('connect')) {
            return 'connection';
        } else if (message.includes('auth') || message.includes('token') || message.includes('permission')) {
            return 'authentication';
        } else if (message.includes('data') || message.includes('parse') || message.includes('format')) {
            return 'data';
        } else {
            return 'unknown';
        }
    }

    private determineSeverity(error: Error, retryCount: number): IntegrationError['severity'] {
        const message = error.message.toLowerCase();
        
        // Critical errors
        if (message.includes('authentication') || message.includes('permission denied')) {
            return 'critical';
        }
        
        // High severity for repeated failures
        if (retryCount >= this.retryOptions.maxRetries) {
            return 'high';
        }
        
        // Medium severity for connection issues
        if (message.includes('connection') || message.includes('timeout')) {
            return 'medium';
        }
        
        // Low severity for other errors
        return 'low';
    }

    private updateHealthStatus(integrationId: string, isConnected: boolean, responseTime: number): void {
        const current = this.healthStatus.get(integrationId) || {
            isConnected: false,
            responseTime: 0,
            lastChecked: new Date(),
            errorCount: 0,
            uptime: 0
        };

        this.healthStatus.set(integrationId, {
            ...current,
            isConnected,
            responseTime: isConnected ? responseTime : 0,
            lastChecked: new Date(),
            errorCount: isConnected ? current.errorCount : current.errorCount + 1
        });
    }

    private getErrorCount(integrationId: string): number {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this.errors.filter(error => 
            error.integrationId === integrationId && 
            error.timestamp > last24Hours
        ).length;
    }

    // Diagnostic methods
    async runDiagnostics(): Promise<{
        integrations: Map<string, ConnectionHealth>;
        errors: IntegrationError[];
        recommendations: string[];
    }> {
        const integrations = await this.checkAllIntegrations();
        const errors = this.getUnresolvedErrors();
        const recommendations: string[] = [];

        // Generate recommendations based on health status
        for (const [integrationId, health] of integrations) {
            if (!health.isConnected) {
                recommendations.push(`${integrationId}: Connection failed - check network connectivity and credentials`);
            } else if (health.responseTime > 1000) {
                recommendations.push(`${integrationId}: High response time (${health.responseTime}ms) - consider optimizing queries or increasing timeout`);
            } else if (health.errorCount > 10) {
                recommendations.push(`${integrationId}: High error count (${health.errorCount}) - investigate recurring issues`);
            }
        }

        // Add error-based recommendations
        const criticalErrors = errors.filter(e => e.severity === 'critical');
        if (criticalErrors.length > 0) {
            recommendations.push(`${criticalErrors.length} critical errors require immediate attention`);
        }

        return {
            integrations,
            errors,
            recommendations
        };
    }
}

// Export singleton instance
export const pricingIntegrationService = new PricingIntegrationService();
export type { RetryOptions, IntegrationError, IntegrationLog, ConnectionHealth };