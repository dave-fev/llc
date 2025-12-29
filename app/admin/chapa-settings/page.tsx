'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Save, Eye, EyeOff, Lock } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

export default function ChapaSettingsPage() {
  const [chapaSettings, setChapaSettings] = useState({
    secretKey: '',
    publicKey: '',
    encryptionKey: '',
    currency: 'USD',
    callbackUrl: '',
    returnUrl: '',
    isActive: false,
    paymentTitle: 'Swift Filling',
    paymentDescription: 'Complete your LLC registration payment',
  });
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchChapaSettings();
  }, []);

  const fetchChapaSettings = async () => {
    try {
      const response = await fetch('/api/admin/chapa-settings');
      if (response.ok) {
        const data = await response.json();
        setChapaSettings(data.chapaSettings || {
          secretKey: '',
          publicKey: '',
          encryptionKey: '',
          currency: 'USD',
          callbackUrl: '',
          returnUrl: '',
          isActive: false,
          paymentTitle: 'Swift Filling',
          paymentDescription: 'Complete your LLC registration payment',
        });
      }
    } catch (error) {
      console.error('Error fetching Chapa settings:', error);
      showNotification('error', 'Failed to load Chapa settings', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!chapaSettings.secretKey || chapaSettings.secretKey.startsWith('***')) {
      showNotification('error', 'Please enter a valid Chapa secret key', 'Validation Error');
      return;
    }
    if (!chapaSettings.publicKey) {
      showNotification('error', 'Please enter Chapa public key', 'Validation Error');
      return;
    }
    // Encryption key is optional but if provided, should be valid (24 bytes for 3DES)
    if (chapaSettings.encryptionKey && chapaSettings.encryptionKey.startsWith('***')) {
      showNotification('error', 'Please enter a valid Chapa encryption key or leave it empty', 'Validation Error');
      return;
    }
    // Validate encryption key length if provided (should be 24 bytes for 3DES)
    if (chapaSettings.encryptionKey && chapaSettings.encryptionKey.length !== 24) {
      showNotification('error', 'Encryption key must be exactly 24 bytes (24 characters) for 3DES encryption', 'Validation Error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/chapa-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chapaSettings),
      });

      if (response.ok) {
        showNotification('success', 'Chapa settings saved successfully!', 'Success');
        fetchChapaSettings(); // Reload to get masked secret key
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to save Chapa settings', 'Error');
      }
    } catch (error) {
      console.error('Error saving Chapa settings:', error);
      showNotification('error', 'Failed to save Chapa settings', 'Error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <>
      {NotificationComponent}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2">Chapa Payment Settings</h1>
          <p className="text-neutral-600">Configure Chapa payment gateway credentials and settings</p>
        </div>

        {/* Chapa Credentials */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900">API Credentials</h2>
              <p className="text-sm text-neutral-600">Your Chapa API keys from the Chapa dashboard</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Secret Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={chapaSettings.secretKey}
                  onChange={(e) => setChapaSettings({ ...chapaSettings, secretKey: e.target.value })}
                  placeholder="chsk_..."
                  className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {showSecretKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Your Chapa secret key (starts with chsk_)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Public Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={chapaSettings.publicKey}
                onChange={(e) => setChapaSettings({ ...chapaSettings, publicKey: e.target.value })}
                placeholder="chpk_..."
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all font-mono"
              />
              <p className="text-xs text-neutral-500 mt-1">Your Chapa public key (starts with chpk_)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Encryption Key (Optional)
              </label>
              <div className="relative">
                <input
                  type={showEncryptionKey ? 'text' : 'password'}
                  value={chapaSettings.encryptionKey || ''}
                  onChange={(e) => setChapaSettings({ ...chapaSettings, encryptionKey: e.target.value })}
                  placeholder="24-byte encryption key for Direct Charge API"
                  className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {showEncryptionKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Your Chapa encryption key (24 bytes) for Direct Charge API. Found in Chapa Dashboard → Settings → API.
                <br />
                <span className="text-amber-600 font-semibold">Required only if using Direct Charge API with 3DES encryption.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Configuration */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Payment Configuration</h2>
              <p className="text-sm text-neutral-600">Configure payment settings and URLs</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  Currency
                </label>
                <select
                  value={chapaSettings.currency}
                  onChange={(e) => setChapaSettings({ ...chapaSettings, currency: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="ETB">ETB - Ethiopian Birr</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={chapaSettings.isActive}
                  onChange={(e) => setChapaSettings({ ...chapaSettings, isActive: e.target.checked })}
                  className="w-5 h-5 text-neutral-900 border-2 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-neutral-900 cursor-pointer">
                  Enable Chapa Payments
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Callback URL
              </label>
              <input
                type="text"
                value={chapaSettings.callbackUrl}
                onChange={(e) => setChapaSettings({ ...chapaSettings, callbackUrl: e.target.value })}
                placeholder="https://yourdomain.com/api/chapa/callback"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Leave empty to use default: /api/chapa/callback</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Return URL
              </label>
              <input
                type="text"
                value={chapaSettings.returnUrl}
                onChange={(e) => setChapaSettings({ ...chapaSettings, returnUrl: e.target.value })}
                placeholder="https://yourdomain.com/payment/success"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Leave empty to use default: /payment/success</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Payment Title
              </label>
              <input
                type="text"
                value={chapaSettings.paymentTitle}
                onChange={(e) => setChapaSettings({ ...chapaSettings, paymentTitle: e.target.value })}
                placeholder="Swift Filling"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Title shown on Chapa payment page</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Payment Description
              </label>
              <textarea
                value={chapaSettings.paymentDescription}
                onChange={(e) => setChapaSettings({ ...chapaSettings, paymentDescription: e.target.value })}
                placeholder="Complete your LLC registration payment"
                rows={3}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all resize-none"
              />
              <p className="text-xs text-neutral-500 mt-1">Description shown on Chapa payment page</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Chapa Settings'}
          </button>
        </div>
      </div>
    </>
  );
}

