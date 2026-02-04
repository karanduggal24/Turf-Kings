'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDB() {
  const [status, setStatus] = useState('Testing connection...');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test connection by trying to access users table
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);

        if (error) {
          setStatus(`❌ Error: ${error.message}`);
          return;
        }

        setStatus('✅ Connection successful!');

        // Try to get table info
        const { data: turfsData, error: turfsError } = await supabase
          .from('turfs')
          .select('count')
          .limit(1);

        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('count')
          .limit(1);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('count')
          .limit(1);

        const availableTables = [];
        if (!turfsError) availableTables.push('turfs');
        if (!bookingsError) availableTables.push('bookings');
        if (!reviewsError) availableTables.push('reviews');
        availableTables.push('users');

        setTables(availableTables);

      } catch (err: any) {
        setStatus(`❌ Connection failed: ${err.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">Database Connection Test</h1>
        
        <div className="bg-surface-dark p-6 rounded-lg border border-surface-highlight">
          <h2 className="text-xl font-semibold mb-4">Connection Status:</h2>
          <p className="text-lg mb-6">{status}</p>

          {tables.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Available Tables:</h3>
              <ul className="space-y-2">
                {tables.map((table) => (
                  <li key={table} className="flex items-center">
                    <span className="text-primary mr-2">✅</span>
                    <span className="font-mono">{table}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 p-4 bg-surface-highlight rounded border-l-4 border-primary">
            <h4 className="font-semibold mb-2">Next Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>If connection is successful, you can start using the API</li>
              <li>Create some sample turfs using the API endpoints</li>
              <li>Test user authentication</li>
              <li>Remove this test page when done</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}