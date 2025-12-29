'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock, Save, MapPin } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

export default function ContactSettingsPage() {
  const [contactSettings, setContactSettings] = useState({
    phoneNumber: '',
    phoneDisplay: '',
    supportEmail: '',
    contactEmail: '',
    businessHours: '',
    streetAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const response = await fetch('/api/admin/contact-settings');
        if (response.ok) {
          const data = await response.json();
          const settings = data.contactSettings || {};
          // Ensure all fields are strings, not null or undefined
          setContactSettings({
            phoneNumber: settings.phoneNumber || '18007943835',
            phoneDisplay: settings.phoneDisplay || '1-800-SWIFT-FILL',
            supportEmail: settings.supportEmail || 'support@swiftsfilling.com',
            contactEmail: settings.contactEmail || 'support@swiftsfilling.com',
            businessHours: settings.businessHours || 'Mon-Fri 9AM-6PM EST',
            streetAddress: settings.streetAddress || '',
            addressLine2: settings.addressLine2 || '',
            city: settings.city || '',
            state: settings.state || '',
            zipCode: settings.zipCode || '',
            country: settings.country || 'United States',
          });
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error);
        showNotification('error', 'Failed to load contact settings', 'Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactSettings();
  }, []);

  const handleSave = async () => {
    // Validation
    if (!contactSettings.phoneNumber || !contactSettings.phoneDisplay) {
      showNotification('error', 'Phone number and display text are required', 'Validation Error');
      return;
    }
    if (!contactSettings.supportEmail || !contactSettings.contactEmail) {
      showNotification('error', 'Support email and contact email are required', 'Validation Error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactSettings.supportEmail)) {
      showNotification('error', 'Please enter a valid support email address', 'Validation Error');
      return;
    }
    if (!emailRegex.test(contactSettings.contactEmail)) {
      showNotification('error', 'Please enter a valid contact email address', 'Validation Error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/contact-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactSettings),
      });

      if (response.ok) {
        showNotification('success', 'Contact settings saved successfully!', 'Success');
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to save contact settings', 'Error');
      }
    } catch (error) {
      console.error('Error saving contact settings:', error);
      showNotification('error', 'Failed to save contact settings', 'Error');
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
          <h1 className="text-4xl font-black text-neutral-900 mb-2">Contact Settings</h1>
          <p className="text-neutral-600">Configure contact email and phone information displayed on your website</p>
        </div>

        {/* Contact Settings Form */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Phone Information</h2>
              <p className="text-sm text-neutral-600">Configure phone number displayed on the website</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Phone Number (for tel: link) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactSettings.phoneNumber || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, phoneNumber: e.target.value })}
                placeholder="18007943835"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Numbers only, no spaces or dashes (e.g., 18007943835)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Phone Display Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactSettings.phoneDisplay || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, phoneDisplay: e.target.value })}
                placeholder="1-800-SWIFT-FILL"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Text shown to users (e.g., 1-800-SWIFT-FILL)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Business Hours
              </label>
              <input
                type="text"
                value={contactSettings.businessHours || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, businessHours: e.target.value })}
                placeholder="Mon-Fri 9AM-6PM EST"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Business hours display text (e.g., Mon-Fri 9AM-6PM EST)</p>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Email Information</h2>
              <p className="text-sm text-neutral-600">Configure email addresses displayed on the website</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Support Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactSettings.supportEmail || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, supportEmail: e.target.value })}
                placeholder="support@swiftsfilling.com"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Email address displayed for support inquiries (shown in footer and contact page)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactSettings.contactEmail || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, contactEmail: e.target.value })}
                placeholder="contact@swiftsfilling.com"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Email address where contact form submissions will be sent</p>
            </div>
          </div>
        </div>

        {/* Address Settings */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Address Information</h2>
              <p className="text-sm text-neutral-600">Configure business address displayed on the website</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={contactSettings.streetAddress || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, streetAddress: e.target.value })}
                placeholder="123 Business Ave"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={contactSettings.addressLine2 || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, addressLine2: e.target.value })}
                placeholder="Suite 100"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={contactSettings.city || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, city: e.target.value })}
                  placeholder="New York"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={contactSettings.state || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, state: e.target.value })}
                  placeholder="NY"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={contactSettings.zipCode || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, zipCode: e.target.value })}
                  placeholder="10001"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Country
              </label>
              <input
                type="text"
                value={contactSettings.country || ''}
                onChange={(e) => setContactSettings({ ...contactSettings, country: e.target.value })}
                placeholder="United States"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border-2 border-neutral-200 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Preview</h2>
              <p className="text-sm text-neutral-600">How your contact information will appear on the website</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-600 uppercase mb-3">Phone</h3>
              <a href={`tel:${contactSettings.phoneNumber || '18007943835'}`} className="text-xl font-black text-neutral-900 hover:text-neutral-700 transition-colors block mb-2">
                {contactSettings.phoneDisplay || '1-800-SWIFT-FILL'}
              </a>
              {contactSettings.businessHours && (
                <p className="text-sm text-neutral-500">{contactSettings.businessHours}</p>
              )}
            </div>
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-600 uppercase mb-3">Email</h3>
              <a href={`mailto:${contactSettings.supportEmail || 'support@swiftsfilling.com'}`} className="text-xl font-black text-neutral-900 hover:text-neutral-700 transition-colors block">
                {contactSettings.supportEmail || 'support@swiftsfilling.com'}
              </a>
            </div>
            {(contactSettings.streetAddress || contactSettings.city) && (
              <div className="bg-white rounded-xl p-6 border border-neutral-200 md:col-span-2">
                <h3 className="text-sm font-bold text-neutral-600 uppercase mb-3">Address</h3>
                <div className="text-base font-medium text-neutral-900">
                  {contactSettings.streetAddress && <p>{contactSettings.streetAddress}</p>}
                  {contactSettings.addressLine2 && <p>{contactSettings.addressLine2}</p>}
                  {(contactSettings.city || contactSettings.state || contactSettings.zipCode) && (
                    <p>
                      {[contactSettings.city, contactSettings.state, contactSettings.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  {contactSettings.country && <p>{contactSettings.country}</p>}
                </div>
              </div>
            )}
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
            {isSaving ? 'Saving...' : 'Save Contact Settings'}
          </button>
        </div>
      </div>
    </>
  );
}

