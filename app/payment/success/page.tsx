'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [txRef, setTxRef] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    const ref = searchParams.get('tx_ref');

    setTxRef(ref);

    const checkPaymentAndSave = async () => {
      if (status === 'success' || status === 'successful') {
        // Save order to database if payment is successful
        if (ref) {
          try {
            // Get form data from localStorage (Redux persist)
            const formDataStr = localStorage.getItem('persist:root');
            if (formDataStr) {
              const persisted = JSON.parse(formDataStr);
              if (persisted.form) {
                const formState = JSON.parse(persisted.form);
                const formData = formState.formData;

                // Calculate total amount
                const BASE_SERVICE_FEE = 39;
                const PROCESSING_FEE = 5;
                const selectedServices = [
                  { id: 'ein', price: 79 },
                  { id: 'website', price: 299 },
                  { id: 'itin', price: 149 },
                  { id: 'branding', price: 399 },
                ].filter((service) => formData.additionalServices[service.id]);
                const servicesTotal = selectedServices.reduce((sum: number, s: any) => sum + s.price, 0);
                const total = BASE_SERVICE_FEE + formData.stateFee + servicesTotal + PROCESSING_FEE;

                // Get transaction ID from URL params if available
                const transactionId = searchParams.get('transaction_id');

                // Save order to database and create user account
                const saveResponse = await fetch('/api/orders/save-from-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    txRef: ref,
                    transactionId: transactionId || undefined,
                    formData: formData,
                    amount: total,
                  }),
                });

                if (saveResponse.ok) {
                  const saveData = await saveResponse.json();
                  console.log('Order saved successfully:', saveData);

                  // Set payment status to success
                  setPaymentStatus('success');

                  // Auto-login user if email and password were provided
                  if (formData.accountEmail && formData.password) {
                    setIsLoggingIn(true);
                    try {
                      const loginResponse = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          email: formData.accountEmail,
                          password: formData.password,
                        }),
                        credentials: 'include', // Important for cookies
                      });

                      if (loginResponse.ok) {
                        const loginData = await loginResponse.json();
                        console.log('User auto-logged in successfully:', loginData);
                        setLoginSuccess(true);
                        setIsLoggingIn(false);

                        // Wait a moment to ensure cookie is set, then verify and redirect
                        // Add a small delay to allow cookie propagation
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // Verify login was successful by checking if we can access the profile
                        // Retry a few times if needed
                        let profileVerified = false;
                        for (let i = 0; i < 3; i++) {
                          try {
                            const profileCheck = await fetch('/api/user/profile', {
                              credentials: 'include',
                              headers: {
                                'Cache-Control': 'no-cache',
                              }
                            });

                            if (profileCheck.ok) {
                              profileVerified = true;
                              break;
                            }
                            // Wait before retry
                            await new Promise(resolve => setTimeout(resolve, 500));
                          } catch (checkError) {
                            console.error(`Profile check attempt ${i + 1} failed:`, checkError);
                          }
                        }

                        // Always redirect to dashboard - cookie should be set by now
                        if (profileVerified) {
                          console.log('✓ Login verified, redirecting to dashboard');
                        } else {
                          console.warn('⚠️ Profile check failed after retries, but redirecting anyway (cookie should be set)');
                        }
                        // Use window.location.href for hard redirect to ensure cookie is recognized
                        window.location.href = '/user';
                      } else {
                        const errorData = await loginResponse.json();
                        console.error('Auto-login failed:', errorData);
                        setIsLoggingIn(false);
                      }
                    } catch (loginError) {
                      console.error('Error auto-logging in user:', loginError);
                      setIsLoggingIn(false);
                      // Don't fail if auto-login fails, user can still manually login
                    }
                  }
                } else {
                  console.error('Failed to save order');
                  setPaymentStatus('failed');
                }
              } else {
                // No form data, but payment was successful
                setPaymentStatus('success');
              }
            } else {
              // No persisted data, but payment was successful
              setPaymentStatus('success');
            }
          } catch (error) {
            console.error('Error saving order:', error);
            // Still show success if payment was successful
            setPaymentStatus('success');
          }
        } else {
          // No tx_ref, but status is success
          setPaymentStatus('success');
        }
      } else if (status === 'failed' || status === 'cancelled') {
        setPaymentStatus('failed');
      } else {
        // Verify payment status with your backend
        // For now, assume success if no status is provided
        setPaymentStatus('success');
      }
    };

    checkPaymentAndSave();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 text-center">
        {paymentStatus === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-neutral-900 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-black text-neutral-900 mb-2">Processing Payment</h1>
            <p className="text-neutral-600">Please wait while we verify your payment...</p>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-neutral-900 mb-2">Payment Successful!</h1>
            <p className="text-neutral-600 mb-6">
              Your payment has been processed successfully. Your LLC registration is now being processed.
            </p>
            {txRef && (
              <p className="text-sm text-neutral-500 mb-6">
                Transaction Reference: <span className="font-mono">{txRef}</span>
              </p>
            )}

            {isLoggingIn && !loginSuccess && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <p className="text-sm font-semibold text-blue-700">Logging you in...</p>
                </div>
              </div>
            )}

            {loginSuccess && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">Login successful! Redirecting to your dashboard...</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {!loginSuccess && (
                <>
                  <button
                    onClick={() => window.location.href = '/user'}
                    className="block w-full px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard
                  </button>
                  <Link
                    href="/"
                    className="block w-full px-6 py-3 bg-neutral-50 border-2 border-neutral-200 text-neutral-900 font-bold rounded-xl hover:bg-neutral-100 transition-all duration-300"
                  >
                    Return to Home
                  </Link>
                </>
              )}
              {loginSuccess && (
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting to dashboard...</span>
                </div>
              )}
            </div>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-neutral-900 mb-2">Payment Failed</h1>
            <p className="text-neutral-600 mb-6">
              Unfortunately, your payment could not be processed. Please try again or contact support.
            </p>
            {txRef && (
              <p className="text-sm text-neutral-500 mb-6">
                Transaction Reference: <span className="font-mono">{txRef}</span>
              </p>
            )}
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
              <Link
                href="/contact"
                className="block w-full px-6 py-3 bg-neutral-50 border-2 border-neutral-200 text-neutral-900 font-bold rounded-xl hover:bg-neutral-100 transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 text-center">
          <Loader2 className="w-16 h-16 text-neutral-900 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-black text-neutral-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}

