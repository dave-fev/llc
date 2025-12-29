'use client';

import React, { useEffect, useState } from 'react';
import { Power, Loader2 } from 'lucide-react';

export default function MaintenancePage() {
  const [message, setMessage] = useState('We are currently performing scheduled maintenance. We will be back shortly. Thank you for your patience.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/admin/maintenance');
        if (response.ok) {
          const data = await response.json();

          // If maintenance mode is disabled, redirect to home
          if (!data.maintenanceMode?.enabled) {
            window.location.href = '/';
            return;
          }

          if (data.maintenanceMode.showMessage) {
            setMessage(data.maintenanceMode.message || message);
          }
        }
      } catch (error) {
        console.error('Error fetching maintenance message:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
          <Power className="w-12 h-12 text-neutral-900" />
        </div>
        <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
          Under Maintenance
        </h1>
        <p className="text-xl text-neutral-300 mb-8 leading-relaxed max-w-lg mx-auto">
          {message}
        </p>
        <div className="flex items-center justify-center gap-2 text-neutral-400">
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
          <span className="text-sm">We'll be back soon</span>
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}



