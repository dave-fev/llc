'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Mail, CreditCard, FileText, UserPlus, Key } from 'lucide-react';

const testTypes = [
  {
    id: 'payment-success',
    name: 'Payment Success Email',
    icon: CreditCard,
    description: 'Test email sent when payment is successful',
  },
  {
    id: 'document-sent',
    name: 'Document Sent Email',
    icon: FileText,
    description: 'Test email sent when admin sends a document',
  },
  {
    id: 'account-created',
    name: 'Account Created Email',
    icon: UserPlus,
    description: 'Test email sent when a new account is created',
  },
  {
    id: 'password-reset',
    name: 'Password Reset Email',
    icon: Key,
    description: 'Test email sent for password reset',
  },
  {
    id: 'contact-form',
    name: 'Contact Form Email',
    icon: Mail,
    description: 'Test contact form email to support@swiftsfilling.com',
  },
];

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const testEmail = async (testType: string) => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(testType);
    setResults((prev) => ({ ...prev, [testType]: { success: false, message: 'Sending...' } }));

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          email,
        }),
      });

      const data = await response.json();

      setResults((prev) => ({
        ...prev,
        [testType]: {
          success: data.success,
          message: data.message || data.error || 'Unknown error',
        },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [testType]: {
          success: false,
          message: 'Failed to send test email. Check console for errors.',
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const testAll = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    for (const testType of testTypes) {
      await testEmail(testType.id);
      // Wait a bit between emails
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-neutral-900">Email Testing</h1>
              <p className="text-neutral-600">Test each email function individually</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              Test Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black"
            />
            <p className="text-xs text-neutral-500 mt-2">
              All test emails will be sent to this address
            </p>
          </div>

          <button
            onClick={async () => {
              if (!email) {
                alert('Please enter an email address');
                return;
              }

              setLoading('all');
              setResults({});

              try {
                const response = await fetch('/api/test-emails-send', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (data.results) {
                  const newResults: Record<string, { success: boolean; message: string }> = {};
                  data.results.forEach((result: any) => {
                    newResults[result.name.toLowerCase().replace(/\s+/g, '-')] = {
                      success: result.success,
                      message: result.message,
                    };
                  });
                  setResults(newResults);
                }

                if (data.success) {
                  alert('✅ All emails sent successfully! Check your inbox.');
                } else {
                  alert(`⚠️ ${data.message}`);
                }
              } catch (error) {
                alert('Failed to send test emails. Check console for errors.');
              } finally {
                setLoading(null);
              }
            }}
            disabled={!email || loading !== null}
            className="w-full px-6 py-3 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white font-bold rounded-xl hover:from-neutral-800 hover:to-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
          >
            {loading === 'all' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending All Emails...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send All Test Emails
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {testTypes.map((test) => {
            const Icon = test.icon;
            const result = results[test.id];
            const isLoading = loading === test.id;

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-neutral-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-neutral-900 mb-1">
                        {test.name}
                      </h3>
                      <p className="text-sm text-neutral-600">{test.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => testEmail(test.id)}
                    disabled={!email || isLoading || loading !== null}
                    className="px-4 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Test
                      </>
                    )}
                  </button>
                </div>

                {result && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-2 ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <p
                        className={`text-sm font-bold ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-black text-blue-900 mb-2">Testing Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Enter your email address above</li>
            <li>Click "Test" on each email type to test individually</li>
            <li>Or click "Test All Emails" to test all at once</li>
            <li>Check your email inbox (and spam folder) for the test emails</li>
            <li>Verify that each email displays correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

