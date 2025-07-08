import { useState } from 'react';
import { Database as DatabaseIcon, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { testSupabaseConnection } from '../services/supabaseService';

export default function DatabaseStatusPanel() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [message, setMessage] = useState('');

  const handleTest = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const success = await testSupabaseConnection();
      if (success) {
        setStatus('success');
        setMessage('Verbindung aktiv');
      } else {
        setStatus('error');
        setMessage('Fehler bei Verbindung');
      }
    } catch {
      setStatus('error');
      setMessage('Fehler beim Testen');
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5" style={{ color: '#F29400' }} />;
      case 'error':
        return <XCircle className="h-5 w-5" style={{ color: '#F29400' }} />;
      case 'loading':
        return <RefreshCw className="h-5 w-5 animate-spin" style={{ color: '#F29400' }} />;
      default:
        return <AlertCircle className="h-5 w-5" style={{ color: '#F29400' }} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 space-y-4">
      <div className="flex items-center space-x-3">
        <DatabaseIcon className="h-6 w-6" style={{ color: '#F29400' }} />
        <h3 className="text-lg font-medium text-gray-900">Datenbankstatus</h3>
      </div>
      <div className="flex items-center space-x-2">
        {renderIcon()}
        {message && <span className="text-sm">{message}</span>}
      </div>
      <button
        onClick={handleTest}
        disabled={status === 'loading'}
        className="px-3 py-2 text-white rounded-md disabled:opacity-50"
        style={{ backgroundColor: '#F29400' }}
      >
        Verbindung testen
      </button>
    </div>
  );
}
