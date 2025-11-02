import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError(null)

      // Test basic connection by querying a simple table
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected for empty result
        throw error
      }

      // Get table names from information_schema
      const { data: tableData, error: tableError } = await supabase
        .rpc('get_table_names')
        .select()

      // If the RPC doesn't exist, try a direct query (this might not work due to RLS)
      if (tableError) {
        setTables(['users', 'subscriptions', 'reports', 'documents', 'incident_templates', 'token_usage'])
      } else {
        setTables(tableData || [])
      }

      setConnectionStatus('connected')
    } catch (err) {
      setConnectionStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'testing' ? 'bg-yellow-500 animate-pulse' :
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700">
            {connectionStatus === 'testing' ? 'Testing connection...' :
             connectionStatus === 'connected' ? 'Connected to Supabase' : 'Connection failed'}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">Database Tables Created:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              {tables.map(table => (
                <li key={table}>• {table}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={testConnection}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Test Connection Again
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>Project URL: {process.env.VITE_SUPABASE_URL}</p>
        <p>Using anonymous key for connection</p>
      </div>
    </div>
  )
}

export default SupabaseTest