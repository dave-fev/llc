'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart?: () => void;
}

export function LoginForm({ open, onOpenChange, onStart }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Login successful - user authenticated from database
      setIsLoading(false);
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setError(null);

      // Show success message briefly
      console.log('Login successful:', data.user);

      // Redirect to user dashboard
      router.push('/user');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect to server. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleCreateLLC = () => {
    onOpenChange(false);
    // Save that user has started
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('swift_filling_has_started', JSON.stringify(true));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    // Navigate to form page
    router.push('/form');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 p-10 border border-neutral-200 animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neutral-50 to-transparent rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-neutral-50 to-transparent rounded-full blur-3xl -z-0"></div>

          {/* Close Button */}
          <Dialog.Close className="absolute top-6 right-6 p-2.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-300 z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Dialog.Close>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl mb-6 shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Dialog.Title className="text-4xl font-black text-neutral-900 mb-3 tracking-tight">
                Welcome Back
              </Dialog.Title>
              <Dialog.Description className="text-neutral-600 text-lg font-medium">
                Sign in to access your account and continue your LLC formation
              </Dialog.Description>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm font-bold text-red-700">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full h-16 pl-14 pr-5 border-2 border-neutral-200 rounded-2xl focus:border-neutral-900 focus:outline-none transition-all duration-300 text-black placeholder:text-neutral-400 bg-white hover:border-neutral-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-neutral-900 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-16 pl-14 pr-16 border-2 border-neutral-200 rounded-2xl focus:border-neutral-900 focus:outline-none transition-all duration-300 text-black placeholder:text-neutral-400 bg-white hover:border-neutral-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-300"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-neutral-900 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 cursor-pointer transition-all"
                  />
                  <span className="ml-3 text-sm font-semibold text-neutral-700 group-hover:text-neutral-900 transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white font-black rounded-2xl hover:from-neutral-800 hover:to-neutral-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors mt-2"
              >
                Forgot Password?
              </button>
            </form>

            {/* Create LLC Link */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="text-center">
                <p className="text-neutral-600 mb-4 font-medium">
                  New to Swift Filling?
                </p>
                <button
                  type="button"
                  onClick={handleCreateLLC}
                  className="w-full h-14 bg-white border-2 border-neutral-900 text-neutral-900 font-black rounded-2xl hover:bg-neutral-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Your LLC</span>
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Forgot Password Dialog */}
      <Dialog.Root open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 p-8 border border-neutral-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Dialog.Close className="absolute top-6 right-6 p-2.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>

            <div className="text-center mb-6">
              <Dialog.Title className="text-2xl font-black text-neutral-900 mb-2">Reset Password</Dialog.Title>
              <Dialog.Description className="text-neutral-600">Enter your email address and we'll send you a reset link.</Dialog.Description>
            </div>

            {forgotPasswordLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                  <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-blue-900 mb-2">Sending Reset Link...</h3>
                <p className="text-sm sm:text-base text-blue-800 font-medium text-center px-4">Please wait while we send your password reset email. This may take a few seconds.</p>
              </div>
            ) : forgotPasswordSuccess ? (
              <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-emerald-900 mb-2">Reset Link Sent Successfully!</h3>
                <p className="text-sm sm:text-base text-emerald-800 font-medium text-center mb-2 px-4">If an account exists with this email, a password reset link has been sent.</p>
                <p className="text-xs sm:text-sm text-emerald-700 text-center px-4 mb-6">Please check your email inbox and follow the instructions to reset your password.</p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSuccess(false);
                    setForgotPasswordEmail('');
                    setError(null);
                  }}
                  className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotPasswordLoading(true);
                  setError(null);
                  
                  // Validate email format
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(forgotPasswordEmail)) {
                    setError('Please enter a valid email address.');
                    setForgotPasswordLoading(false);
                    return;
                  }

                  try {
                    const response = await fetch('/api/auth/forgot-password', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotPasswordEmail }),
                    });

                    let data;
                    try {
                      data = await response.json();
                    } catch (jsonError) {
                      console.error('Failed to parse response as JSON:', jsonError);
                      setError('Server error. Please check your email configuration and try again.');
                      setForgotPasswordLoading(false);
                      return;
                    }

                    if (!response.ok) {
                      console.error('Password reset error:', data);
                      const errorMessage = data?.error || data?.message || 'Failed to send reset email. Please check your email configuration.';
                      setError(errorMessage);
                      setForgotPasswordLoading(false);
                      return;
                    }

                    if (data.success) {
                      // Check if email was actually sent (similar to contact form)
                      // The API always returns success to prevent email enumeration,
                      // but we show success message anyway
                      setForgotPasswordSuccess(true);
                      setForgotPasswordLoading(false);
                      setError(null);
                    } else {
                      console.error('Password reset error:', data);
                      const errorMessage = data?.error || data?.message || 'Failed to send reset email. Please try again.';
                      setError(errorMessage);
                      setForgotPasswordLoading(false);
                    }
                  } catch (err: any) {
                    console.error('Error submitting password reset request:', err);
                    setError('Failed to send reset email. Please check your connection and email configuration, then try again.');
                    setForgotPasswordLoading(false);
                  }
                }}
                className="space-y-4"
              >
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold text-sm">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full h-14 pl-12 pr-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className={`w-full h-14 bg-neutral-900 text-white font-black rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    forgotPasswordLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-neutral-800'
                  }`}
                >
                  {forgotPasswordLoading ? (
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
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Dialog.Root>
  );
}

