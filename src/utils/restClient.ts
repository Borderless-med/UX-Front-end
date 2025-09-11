/**
 * Centralized REST client for all Supabase operations
 * Replaces SDK calls with direct REST API calls for better performance
 */

const SUPABASE_URL = "https://uzppuebjzqxeavgmwtvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA";

interface RestClientOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

interface RequestQueueItem {
  url: string;
  options: RequestInit;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retryCount: number;
}

class RestClient {
  private requestQueue: RequestQueueItem[] = [];
  private isProcessingQueue = false;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private getDefaultHeaders(authToken?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
    }

    return headers;
  }

  private getCacheKey(url: string, options: RequestInit): string {
    return `${url}_${JSON.stringify(options)}`;
  }

  private isValidCacheEntry(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private async executeRequest(
    url: string, 
    options: RequestInit, 
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    const { timeout = 8000, retries = 2 } = clientOptions;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getDefaultHeaders(),
          ...clientOptions.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      
      throw error;
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const item = this.requestQueue.shift()!;
      
      try {
        const result = await this.executeRequest(item.url, item.options, { retries: 0 });
        item.resolve(result);
      } catch (error) {
        if (item.retryCount < 2) {
          // Retry with exponential backoff
          const delay = Math.pow(2, item.retryCount) * 1000 + Math.random() * 500;
          setTimeout(() => {
            this.requestQueue.unshift({
              ...item,
              retryCount: item.retryCount + 1,
            });
          }, delay);
        } else {
          item.reject(error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private async queueRequest(url: string, options: RequestInit): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        url,
        options,
        resolve,
        reject,
        retryCount: 0,
      });
      
      this.processQueue();
    });
  }

  // Public API methods

  async select(
    table: string, 
    options: {
      select?: string;
      filter?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
      single?: boolean;
    } = {},
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    const params = new URLSearchParams();
    
    if (options.select) {
      params.append('select', options.select);
    } else {
      params.append('select', '*');
    }

    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        params.append(key, `eq.${value}`);
      });
    }

    if (options.order) {
      const direction = options.order.ascending === false ? 'desc' : 'asc';
      params.append('order', `${options.order.column}.${direction}`);
    }

    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;
    const cacheKey = this.getCacheKey(url, { method: 'GET' });

    // Check cache first (for GET requests)
    if (clientOptions.timeout !== 0) { // Skip cache if timeout is 0
      const cached = this.cache.get(cacheKey);
      if (cached && this.isValidCacheEntry(cached)) {
        console.log('🎯 Cache hit for:', table);
        return options.single ? cached.data[0] : cached.data;
      }
    }

    console.log('🚀 REST fetch:', table, 'URL:', url);
    const startTime = performance.now();

    try {
      const data = await this.executeRequest(url, { method: 'GET' }, clientOptions);
      
      const endTime = performance.now();
      console.log(`✅ REST ${table} completed in ${(endTime - startTime).toFixed(1)}ms`);

      // Cache successful responses for 30 seconds
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: 30000,
      });

      return options.single ? data[0] : data;
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ REST ${table} failed after ${(endTime - startTime).toFixed(1)}ms:`, error);
      throw error;
    }
  }

  async insert(
    table: string,
    data: any,
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    
    console.log('📝 REST insert:', table);
    
    return await this.executeRequest(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      clientOptions
    );
  }

  async update(
    table: string,
    data: any,
    filter: Record<string, any>,
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });

    const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;
    
    console.log('✏️ REST update:', table);
    
    return await this.executeRequest(
      url,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      clientOptions
    );
  }

  async invokeFunction(
    functionName: string,
    options: {
      body?: any;
      headers?: Record<string, string>;
    } = {},
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    const url = `${SUPABASE_URL}/functions/v1/${functionName}`;
    
    console.log('⚡ REST function invoke:', functionName);
    const startTime = performance.now();

    try {
      const result = await this.executeRequest(
        url,
        {
          method: 'POST',
          body: options.body ? JSON.stringify(options.body) : undefined,
        },
        {
          ...clientOptions,
          headers: {
            ...clientOptions.headers,
            ...options.headers,
          },
        }
      );

      const endTime = performance.now();
      console.log(`✅ Function ${functionName} completed in ${(endTime - startTime).toFixed(1)}ms`);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ Function ${functionName} failed after ${(endTime - startTime).toFixed(1)}ms:`, error);
      throw error;
    }
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 REST client cache cleared');
  }

  preloadData(table: string, options: any = {}): void {
    // Fire and forget preload
    this.select(table, options, { timeout: 15000 }).catch(() => {
      // Ignore preload failures
    });
  }
}

// Export singleton instance
export const restClient = new RestClient();

// Export helper functions for common operations
export const restSelect = (table: string, options: any = {}, clientOptions: RestClientOptions = {}) =>
  restClient.select(table, options, clientOptions);

export const restInsert = (table: string, data: any, clientOptions: RestClientOptions = {}) =>
  restClient.insert(table, data, clientOptions);

export const restUpdate = (table: string, data: any, filter: Record<string, any>, clientOptions: RestClientOptions = {}) =>
  restClient.update(table, data, filter, clientOptions);

export const restInvokeFunction = (functionName: string, options: any = {}, clientOptions: RestClientOptions = {}) =>
  restClient.invokeFunction(functionName, options, clientOptions);