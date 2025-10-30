/**
 * Centralized REST client for all Supabase and backend operations
 * Replaces SDK calls with direct REST API calls for better performance
 */

// --- MODIFICATION: Removed hard-coded secrets. Now reading from secure environment variables. ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw an error if the environment variables are not set, to prevent silent failures.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment variables.");
}

interface RestClientOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  authToken?: string;
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
    console.log('DEBUG: REST client Authorization header:', headers['Authorization']);
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
    const { timeout = 8000, retries = 2, authToken } = clientOptions as RestClientOptions & { authToken?: string };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getDefaultHeaders(authToken),
          ...clientOptions.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
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
          const delay = Math.pow(2, item.retryCount) * 1000 + Math.random() * 500;
          setTimeout(() => {
            this.requestQueue.unshift({ ...item, retryCount: item.retryCount + 1 });
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
      this.requestQueue.push({ url, options, resolve, reject, retryCount: 0 });
      this.processQueue();
    });
  }

  async select(
    table: string,
    options: { select?: string; order?: { column: string; ascending: boolean } } = {},
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    // Build the URL for Supabase REST API
    let url = `${SUPABASE_URL}/rest/v1/${table}?`;

    // Add select columns
    if (options.select) {
      url += `select=${options.select}&`;
    } else {
      url += `select=*&`;
    }

    // Add ordering
    if (options.order) {
      url += `order=${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}&`;
    }

    // Remove trailing '&'
    url = url.replace(/&$/, '');

    // Make the request
    return await this.executeRequest(
      url,
      { method: 'GET' },
      clientOptions
    );
  }

  async insert(
    table: string,
    data: any,
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    // Build the URL for Supabase REST API
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    // Make the request
    return await this.executeRequest(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      clientOptions
    );
    // No closing brace here; keep all methods inside the class
  }

  async update(
    table: string,
    data: any,
    filter: Record<string, any>,
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    // Build the URL for Supabase REST API with filter
    let url = `${SUPABASE_URL}/rest/v1/${table}?`;
    Object.keys(filter).forEach((key) => {
      url += `${key}=eq.${filter[key]}&`;
    });
    url = url.replace(/&$/, '');
    // Make the request
    return await this.executeRequest(
      url,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      clientOptions
    );
  }
  }

  async invokeFunction(
    functionName: string,
    options: { body?: any; headers?: Record<string, string>; } = {},
    clientOptions: RestClientOptions = {}
  ): Promise<any> {
    let url: string;
    if (functionName === 'send-appointment-confirmation') {
      url = '/api/send-appointment-confirmation';
      console.log('⚡ Using Vercel API endpoint for booking function.');
    } else {
      url = `${SUPABASE_URL}/functions/v1/${functionName}`;
    }
    console.log('⚡ REST function invoke:', functionName, 'URL:', url);
    const startTime = performance.now();
    try {
      const result = await this.executeRequest(
        url,
        {
          method: 'POST',
          body: options.body ? JSON.stringify(options.body) : undefined,
          headers: options.headers,
        },
        clientOptions
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

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 REST client cache cleared');
  }

  preloadData(table: string, options: any = {}): void {
    this.select(table, options, { timeout: 15000 }).catch(() => {});
  }
}

export const restClient = new RestClient();

export const restSelect = (table: string, options: any = {}, clientOptions: RestClientOptions = {}) =>
  restClient.select(table, options, clientOptions);

export const restInsert = (table: string, data: any, clientOptions: RestClientOptions = {}) =>
  restClient.insert(table, data, clientOptions);

export const restUpdate = (table: string, data: any, filter: Record<string, any>, clientOptions: RestClientOptions = {}) =>
  restClient.update(table, data, filter, clientOptions);

export const restInvokeFunction = (functionName: string, options: any = {}, clientOptions: RestClientOptions = {}) =>
  restClient.invokeFunction(functionName, options, clientOptions);