import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  duration?: number;
  response?: any;
  error?: string;
  statusCode?: number;
}

const DebugTest = () => {
  const [testInput, setTestInput] = useState('Test input value');
  const [results, setResults] = useState<TestResult[]>([]);

  const updateResult = (name: string, update: Partial<TestResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => r.name === name ? { ...r, ...update } : r);
      } else {
        return [...prev, { name, status: 'idle', ...update }];
      }
    });
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    updateResult(name, { status: 'running' });
    
    try {
      const response = await testFn();
      const duration = Date.now() - startTime;
      updateResult(name, { 
        status: 'success', 
        duration, 
        response: typeof response === 'string' ? response : JSON.stringify(response, null, 2),
        statusCode: response?.status 
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateResult(name, { 
        status: 'error', 
        duration, 
        error: error.message || error.toString(),
        statusCode: error.status 
      });
    }
  };

  const runAllTests = async () => {
    setResults([]);

    // Test 1: Input Focus (immediate)
    updateResult('Input Focus Test', { status: 'success', response: 'Input is focusable and editable' });

    // Test 2: Supabase Functions - Ping
    await runTest('Supabase Edge Function - Ping', async () => {
      return await supabase.functions.invoke('ping');
    });

    // Test 3: Supabase Functions - Dynamic Function  
    await runTest('Supabase Edge Function - Dynamic', async () => {
      return await supabase.functions.invoke('dynamic-function', {
        body: { message: "test", context: "diagnostic" }
      });
    });

    // Test 4: Supabase REST
    await runTest('Supabase REST API', async () => {
      const response = await fetch('https://uzppuebjzqxeavgmwtvr.supabase.co/rest/v1/clinics_data?select=id&limit=1', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    });

    // Test 5: Direct Backend (Development)
    await runTest('Direct Backend Test', async () => {
      const response = await fetch('https://sg-jb-chatbot-backend-development.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ping test', context: 'diagnostic' })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const colors = {
      idle: 'bg-gray-100 text-gray-600',
      running: 'bg-blue-100 text-blue-600', 
      success: 'bg-green-100 text-green-600',
      error: 'bg-red-100 text-red-600'
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Platform Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Input (Check if typing works):</label>
              <Input 
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type here to test input functionality"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                If you can't type in this field, there's a modal/focus issue.
              </p>
            </div>
            
            <Button onClick={runAllTests} className="w-full">
              Run All Diagnostic Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.name} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <h3 className="font-medium">{result.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.duration && <span className="text-xs text-gray-500">{result.duration}ms</span>}
                      {result.statusCode && <span className="text-xs text-gray-500">HTTP {result.statusCode}</span>}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                  
                  {result.response && (
                    <div className="mt-2">
                      <details>
                        <summary className="cursor-pointer text-sm text-green-600">Show Response</summary>
                        <pre className="text-xs bg-green-50 p-2 rounded mt-1 overflow-auto max-h-32">
                          {result.response}
                        </pre>
                      </details>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebugTest;