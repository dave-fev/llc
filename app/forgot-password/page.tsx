'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data: any = {};
      try {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        if (!response.ok) {
          setError(`Server error (${response.status}): ${response.statusText || 'Please try again later'}`);
        } else {
          setError('Server error. Please check your email configuration and try again.');
        }
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        console.error('Password reset error:', { 
          status: response.status, 
          statusText: response.statusText, 
          data: data || 'No data received' 
        });
        const errorMessage = data?.error || data?.message || `Server Error (${response.status}): ${response.statusText || 'Failed to send reset email'}`;
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data && data.success) {
        setSuccess(true);
        setIsLoading(false);
        setError(null);
      } else {
        console.error('Password reset error:', data || 'No data received');
        const errorMessage = data?.error || data?.message || 'Failed to send reset email. Please try again.';
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error submitting password reset request:', err);
      const errorMessage = err?.message || 'Failed to send reset email. Please check your connection and email configuration, then try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - AI Image */}
      <div className="hidden lg:flex lg:w-11/24 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-tr-[3rem] rounded-br-[3rem]">
        <div className="absolute inset-0">
          <Image
            src="/im2.png"
            alt="Abstract technology"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-13/24 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Back Button */}
        <Link
          href="/login"
          className="absolute top-6 left-6 lg:top-8 lg:left-8 group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-all duration-300 z-10"
        >
          <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
            <svg className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Back to Login</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 mb-2">Reset Password</h1>
            <p className="text-neutral-600">Enter your email to receive reset instructions</p>
          </div>

          {/* Form - No Container */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                  <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-2">Sending Reset Link...</h3>
                <p className="text-blue-800 font-medium text-center">Please wait while we send your password reset email.</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-emerald-900 mb-2">Reset Link Sent Successfully!</h3>
                <p className="text-emerald-800 font-medium text-center mb-2">If an account exists with this email, a password reset link has been sent.</p>
                <p className="text-sm text-emerald-700 text-center mb-6">Please check your email inbox and follow the instructions.</p>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-3xl font-black text-neutral-900 mb-2">Forgot Password?</h2>
                  <p className="text-sm text-neutral-600">Enter your email address and we'll send you a secure link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                      <p className="font-bold text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-neutral-900 mb-3">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-14 pl-12 pr-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-14 bg-neutral-900 text-white font-black rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-neutral-800'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending Reset Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <Link
                      href="/login"
                      className="text-sm font-bold text-neutral-900 hover:text-neutral-700 transition-colors"
                    >
                      ← Back to Login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
