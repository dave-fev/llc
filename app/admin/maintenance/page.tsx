'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Power, Settings, Loader2, CheckCircle, X } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const router = useRouter();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'We are currently performing scheduled maintenance. We will be back shortly. Thank you for your patience.'
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceMode();
  }, []);

  const fetchMaintenanceMode = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/maintenance');
      
      if (response.status === 401) {
        router.push('/admin-login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.maintenanceMode) {
          setIsMaintenanceMode(data.maintenanceMode.enabled || false);
          setShowMessage(data.maintenanceMode.showMessage !== false);
          setMaintenanceMessage(data.maintenanceMode.message || maintenanceMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance mode:', error);
      setError('Failed to load maintenance mode settings');
    } finally {
      setLoading(false);
    }
  };

  const saveMaintenanceMode = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: isMaintenanceMode,
          message: maintenanceMessage.trim() || 'We are currently performing scheduled maintenance. We will be back shortly. Thank you for your patience.',
          showMessage: showMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || `Failed to update maintenance mode (Status: ${response.status})`;
        setError(errorMsg);
        console.error('API Error:', data);
        setSaving(false);
        return;
      }

      // Update local state with saved values
      if (data.maintenanceMode) {
        setIsMaintenanceMode(data.maintenanceMode.enabled || false);
        setShowMessage(data.maintenanceMode.showMessage !== false);
        setMaintenanceMessage(data.maintenanceMode.message || maintenanceMessage);
      }

      setSuccess('Maintenance mode settings saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error saving maintenance mode:', error);
      setError(error.message || 'Failed to save maintenance mode settings. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMaintenance = async (checked: boolean) => {
    setIsMaintenanceMode(checked);
    // Auto-save when toggling
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: checked,
          message: maintenanceMessage,
          showMessage: showMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || `Failed to update maintenance mode (Status: ${response.status})`;
        setError(errorMsg);
        console.error('API Error:', data);
        setIsMaintenanceMode(!checked); // Revert on error
        setSaving(false);
        return;
      }

      // Update local state with saved values
      if (data.maintenanceMode) {
        setIsMaintenanceMode(data.maintenanceMode.enabled || false);
        setShowMessage(data.maintenanceMode.showMessage !== false);
        setMaintenanceMessage(data.maintenanceMode.message || maintenanceMessage);
      }

      setSuccess(checked ? 'Maintenance mode enabled' : 'Maintenance mode disabled');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error saving maintenance mode:', error);
      setError(error.message || 'Failed to save maintenance mode settings. Please check your connection and try again.');
      setIsMaintenanceMode(!checked); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="font-bold">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="font-bold">{error}</span>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-neutral-900 mb-2">Maintenance Mode</h1>
        <p className="text-neutral-600">Control site-wide maintenance and access</p>
      </div>

      {/* Maintenance Mode Toggle */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900 mb-2">Maintenance Mode</h2>
              <p className="text-neutral-600">
                When enabled, only administrators can access the site. All other users will see a maintenance message.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saving && <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />}
            <Switch.Root
              checked={isMaintenanceMode}
              onCheckedChange={handleToggleMaintenance}
              disabled={saving}
              className="w-14 h-7 bg-neutral-200 rounded-full relative data-[state=checked]:bg-neutral-900 transition-colors duration-200 outline-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Switch.Thumb className="block w-6 h-6 bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[28px]" />
            </Switch.Root>
          </div>
        </div>

        {isMaintenanceMode && (
          <div className="mt-6 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-amber-900 mb-2">Maintenance Mode Active</h3>
                <p className="text-sm text-amber-800">
                  Your site is currently in maintenance mode. Regular users cannot access the site. Admin users can still access the admin panel.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Maintenance Message */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-neutral-900" />
          <h2 className="text-2xl font-black text-neutral-900">Maintenance Message</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Custom Message
            </label>
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white resize-none"
              placeholder="Enter your maintenance message..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch.Root
              checked={showMessage}
              onCheckedChange={setShowMessage}
              className="w-11 h-6 bg-neutral-200 rounded-full relative data-[state=checked]:bg-neutral-900 transition-colors duration-200 outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
            <label className="text-sm font-semibold text-neutral-700">
              Show maintenance message to users
            </label>
          </div>
          <button
            onClick={saveMaintenanceMode}
            disabled={saving}
            className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h2 className="text-2xl font-black text-neutral-900 mb-6">Preview</h2>
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Power className="w-10 h-10 text-neutral-900" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4">Under Maintenance</h3>
          <p className="text-lg text-neutral-300 max-w-md mx-auto leading-relaxed">
            {showMessage ? maintenanceMessage : 'Maintenance in progress...'}
          </p>
        </div>
      </div>
    </div>
  );
}
