
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { migrateClinicData } from '@/utils/migrateClinicData';

const DataMigrationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMigration = async () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      await migrateClinicData();
      setStatus('success');
      setMessage('All 101 clinics have been successfully migrated to the database!');
      
      // Refresh the page after successful migration to load new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Data Migration</h3>
        <p className="text-xs text-gray-600">
          Restore all 101 clinics with dentist names, MDA licenses, and treatment data
        </p>
      </div>

      <Button
        onClick={handleMigration}
        disabled={isLoading || status === 'success'}
        className="w-full mb-2"
        variant={status === 'success' ? 'default' : 'outline'}
      >
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {status === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-600" />}
        {!isLoading && status !== 'success' && <Database className="h-4 w-4 mr-2" />}
        {isLoading ? 'Migrating...' : status === 'success' ? 'Migration Complete' : 'Migrate Clinic Data'}
      </Button>

      {message && (
        <div className={`flex items-start gap-2 p-2 rounded text-xs ${
          status === 'success' 
            ? 'bg-green-50 text-green-700' 
            : status === 'error' 
            ? 'bg-red-50 text-red-700'
            : 'bg-blue-50 text-blue-700'
        }`}>
          {status === 'error' && <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />}
          {status === 'success' && <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default DataMigrationButton;
