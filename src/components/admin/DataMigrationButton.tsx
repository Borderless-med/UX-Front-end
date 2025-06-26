
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';

const DataMigrationButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Data Status</h3>
        <p className="text-xs text-gray-600">
          All clinic data is now loaded from the database
        </p>
      </div>

      <div className="flex items-start gap-2 p-2 rounded text-xs bg-green-50 text-green-700">
        <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span>Database integration complete - all clinic data is now sourced from Supabase</span>
      </div>
    </div>
  );
};

export default DataMigrationButton;
