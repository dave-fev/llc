'use client';

import React, { useState } from 'react';
import { Loader2, Mail, CheckCircle, XCircle, Send } from 'lucide-react';

export default function TestContactEmailPage() {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; results?: any } | null>(null);

  const testContactEmail = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Failed to send test email. Check console for errors.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-neutral-900">Test Contact Form Email</h1>
              <p className="text-neutral-600">Test the contact form email functionality</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Test Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black"
            />
            <p className="text-xs text-neutral-500 mt-2">
              This will send a test email to support@swiftsfilling.com and a confirmation to your email
            </p>
          </div>

          <button
            onClick={testContactEmail}
            disabled={!testEmail || loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white font-bold rounded-xl hover:from-neutral-800 hover:to-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Test Contact Email
              </>
            )}
          </button>
        </div>

        {result && (
          <div
            className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-black mb-2 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {result.success ? 'Test Successful!' : 'Test Failed'}
                </h3>
                <p
                  className={`text-sm font-medium mb-3 ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {result.message}
                </p>
                {result.results && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-neutral-700">Support Email:</span>
                      <span
                        className={`font-bold ${
                          result.results.supportEmail === 'Sent'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {result.results.supportEmail}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-neutral-700">User Email:</span>
                      <span
                        className={`font-bold ${
                          result.results.userEmail === 'Sent'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {result.results.userEmail}
                      </span>
                    </div>
                  </div>
                )}
                {result.error && (
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <p className="text-xs font-mono text-red-800">{result.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-black text-blue-900 mb-2">Email Configuration Check</h3>
          <p className="text-sm text-blue-800 mb-3">
            Make sure these environment variables are set in your .env file:
          </p>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside font-mono">
            <li>MAIL_HOST=mail.swiftsfilling.com</li>
            <li>MAIL_PORT=465</li>
            <li>MAIL_USERNAME=support@swiftsfilling.com</li>
            <li>MAIL_PASSWORD=H_ffpE456j*B.jkE</li>
            <li>MAIL_ENCRYPTION=ssl</li>
            <li>MAIL_FROM_ADDRESS="support@swiftsfilling.com"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



