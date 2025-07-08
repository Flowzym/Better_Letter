import { useState, useEffect, useCallback } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  getDatabaseStats,
  loadProfileSuggestions,
  type DatabaseStats
} from '../services/supabaseService';

export default function DatabaseStatus() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // DatabaseStats describes the metrics returned from getDatabaseStats
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Supabase is configured
      const configured = isSupabaseConfigured();
      setIsConfigured(configured);
      
      if (configured) {
        // Test connection
        const connected = await testSupabaseConnection();
        setIsConnected(connected);
        
        if (connected) {
          // Get stats
          const dbStats = await getDatabaseStats();
          setStats(dbStats);
          
          // Test loading profile suggestions
          const profileData = await loadProfileSuggestions();
          console.log('Profile data loaded:', profileData);
        }
      }
    } catch (err) {
      console.error('Database status check failed:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6" style={{ color: '#F29400' }} />
          <h2 className="text-xl font-semibold text-gray-900">Datenbank-Status</h2>
        </div>
        <button
          onClick={checkStatus}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Aktualisieren</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Configuration Status */}
        <div className="flex items-center space-x-3">
          {isConfigured ? (
            <CheckCircle className="h-5 w-5" style={{ color: '#F29400' }} />
          ) : (
            <XCircle className="h-5 w-5" style={{ color: '#F29400' }} />
          )}
          <span className="font-medium">
            Supabase-Konfiguration: {isConfigured ? 'Konfiguriert' : 'Nicht konfiguriert'}
          </span>
        </div>

        {/* Connection Status */}
        {isConfigured && (
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <CheckCircle className="h-5 w-5" style={{ color: '#F29400' }} />
            ) : (
              <XCircle className="h-5 w-5" style={{ color: '#F29400' }} />
            )}
            <span className="font-medium">
              Datenbankverbindung: {isConnected ? 'Verbunden' : 'Nicht verbunden'}
            </span>
          </div>
        )}

        {/* Statistics */}
        {stats && stats.categoryCounts && (
                {Object.entries(stats.categoryCounts || {}).map(([category, count]) => (
            <h3 className="font-medium text-gray-900 mb-3">Datenbank-Statistiken</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Gesamt Vorschläge:</span>
                <div className="font-medium">{stats.totalSuggestions || 0}</div>
              </div>
              {Object.entries(stats.categoryCounts).map(([category, count]) => (
                <div key={category}>
                  <span className="text-gray-600 capitalize">{category}:</span>
                  <div className="font-medium">{count as number}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#F29400' }} />
              <p className="font-medium">Fehler:</p>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Instructions */}
        {!isConfigured && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Um die Datenbank zu nutzen, klicken Sie auf "Connect to Supabase" in der oberen rechten Ecke.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}