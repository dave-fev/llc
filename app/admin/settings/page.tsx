'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Mail, Phone, Clock } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useNotification } from '../../hooks/useNotification';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    phoneNumber: '',
    phoneDisplay: '',
    supportEmail: '',
    contactEmail: '',
    businessHours: '',
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
          setContactSettings(data.contactSettings || {
            phoneNumber: '18007943835',
            phoneDisplay: '1-800-SWIFT-FILL',
            supportEmail: 'support@swiftsfilling.com',
            contactEmail: 'support@swiftsfilling.com',
            businessHours: 'Mon-Fri 9AM-6PM EST',
          });
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactSettings();
  }, []);

  const handleSaveContactSettings = async () => {
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

  const settingsSections = [
    {
      title: 'General Settings',
      icon: Settings,
      items: [
        { label: 'Site Name', value: 'Swift Filling', type: 'text' },
        { label: 'Site URL', value: 'https://swiftsfilling.com', type: 'text' },
        { label: 'Admin Email', value: 'admin@swiftsfilling.com', type: 'email' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Email Notifications',
          value: emailNotifications,
          type: 'switch',
          onChange: setEmailNotifications,
        },
        {
          label: 'Push Notifications',
          value: pushNotifications,
          type: 'switch',
          onChange: setPushNotifications,
        },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        {
          label: 'Two-Factor Authentication',
          value: twoFactorAuth,
          type: 'switch',
          onChange: setTwoFactorAuth,
        },
        { label: 'Session Timeout', value: '30 minutes', type: 'select' },
      ],
    },
  ];

  return (
    <>
      {NotificationComponent}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2">Settings</h1>
          <p className="text-neutral-600">Manage your admin panel settings and preferences</p>
        </div>

        {/* Contact Settings Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900">Contact Information</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Phone Number (for tel: link)
              </label>
              <input
                type="text"
                value={contactSettings.phoneNumber}
                onChange={(e) => setContactSettings({ ...contactSettings, phoneNumber: e.target.value })}
                placeholder="18007943835"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Numbers only (e.g., 18007943835)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Phone Display Text
              </label>
              <input
                type="text"
                value={contactSettings.phoneDisplay}
                onChange={(e) => setContactSettings({ ...contactSettings, phoneDisplay: e.target.value })}
                placeholder="1-800-SWIFT-FILL"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Text shown to users (e.g., 1-800-SWIFT-FILL)</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={contactSettings.supportEmail}
                onChange={(e) => setContactSettings({ ...contactSettings, supportEmail: e.target.value })}
                placeholder="support@swiftsfilling.com"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Email address for support inquiries</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={contactSettings.contactEmail}
                onChange={(e) => setContactSettings({ ...contactSettings, contactEmail: e.target.value })}
                placeholder="contact@swiftsfilling.com"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Email address for contact form submissions</p>
            </div>
            <div>
              <label className="text-sm font-bold text-neutral-900 block mb-2">
                Business Hours
              </label>
              <input
                type="text"
                value={contactSettings.businessHours}
                onChange={(e) => setContactSettings({ ...contactSettings, businessHours: e.target.value })}
                placeholder="Mon-Fri 9AM-6PM EST"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
              />
              <p className="text-xs text-neutral-500 mt-1">Business hours display text</p>
            </div>
            <button
              onClick={handleSaveContactSettings}
              disabled={isSaving || isLoading}
              className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Contact Settings'}
            </button>
          </div>
        </div>

        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-neutral-900">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-neutral-200 last:border-0">
                    <div>
                      <label className="text-sm font-bold text-neutral-900 block mb-1">
                        {item.label}
                      </label>
                      {item.type === 'text' || item.type === 'email' ? (
                        <p className="text-xs text-neutral-500">{item.value}</p>
                      ) : null}
                    </div>
                    {item.type === 'switch' && item.onChange ? (
                      <Switch.Root
                        checked={item.value as boolean}
                        onCheckedChange={item.onChange}
                        className="w-11 h-6 bg-neutral-200 rounded-full relative data-[state=checked]:bg-neutral-900 transition-colors duration-200 outline-none cursor-pointer"
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    ) : (
                      <button className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors text-sm font-bold text-neutral-900">
                        Edit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
