'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { useAppDispatch } from '../store/hooks';
import { resetForm } from '../store/formSlice';

interface HeaderProps {
  onStart?: () => void;
}

export function Header({ onStart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is logged in by checking for session cookie
    // Only check on pages where it matters (not on user/admin pages)
    if (pathname?.startsWith('/user') || pathname?.startsWith('/admin')) {
      // User is already on authenticated pages, assume logged in
      setIsLoggedIn(true);
      return;
    }

    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include', // Include cookies in the request
          // Don't throw on 401 - it's expected when not logged in
        });
        // 401 is expected when not logged in, so we handle it gracefully
        setIsLoggedIn(response.ok);
      } catch (error) {
        // Network errors or other issues - assume not logged in
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [pathname]);

  const handleGoHome = () => {
    // Clear form state using Redux
    dispatch(resetForm());

    // Clear hasStarted flag from localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('swift_filling_has_started');
        // Redux-persist will handle clearing form data
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }

    // Navigate to home page
    if (pathname === '/') {
      // If already on home page, reload to reset state
      window.location.href = '/';
    } else {
      router.push('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 group transition-all"
            >
              <img src="/logo.png" alt="Swift Filling Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-transform" />
              <div className="text-lg sm:text-xl md:text-2xl font-black text-neutral-900 group-hover:text-neutral-700">
                Swift <span className="text-neutral-600">Filling</span>
              </div>
            </button>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={handleGoHome}
              className={`font-semibold transition-colors ${pathname === '/'
                ? 'text-neutral-900 border-b-2 border-neutral-900 pb-1'
                : 'text-neutral-700 hover:text-neutral-900'
                }`}
            >
              Home
            </button>
            <Link
              href="/about"
              className={`font-semibold transition-colors ${pathname === '/about'
                ? 'text-neutral-900 border-b-2 border-neutral-900 pb-1'
                : 'text-neutral-700 hover:text-neutral-900'
                }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`font-semibold transition-colors ${pathname === '/contact'
                ? 'text-neutral-900 border-b-2 border-neutral-900 pb-1'
                : 'text-neutral-700 hover:text-neutral-900'
                }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {!isLoggedIn && (
              <Link
                href="/login"
                className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-neutral-200 text-neutral-700 text-sm sm:text-base font-bold rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300"
              >
                Login
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/user"
                className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-neutral-200 text-neutral-700 text-sm sm:text-base font-bold rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                // Save that user has started
                try {
                  if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('swift_filling_has_started', JSON.stringify(true));
                  }
                } catch (error) {
                  console.error('Error saving to localStorage:', error);
                }
                router.push('/form');
              }}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-neutral-900 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <Dialog.Title className="text-xl sm:text-2xl font-black text-neutral-900">Menu</Dialog.Title>
                <Dialog.Close className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Dialog.Close>
              </div>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGoHome();
                  }}
                  className={`text-left px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/'
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                >
                  Home
                </button>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/about'
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/contact'
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                >
                  Contact Us
                </Link>
                {!isLoggedIn && (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 rounded-xl font-semibold transition-all"
                  >
                    Login
                  </Link>
                )}
                {isLoggedIn && (
                  <Link
                    href="/user"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 rounded-xl font-semibold transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Save that user has started
                    try {
                      if (typeof window !== 'undefined' && window.localStorage) {
                        window.localStorage.setItem('swift_filling_has_started', JSON.stringify(true));
                      }
                    } catch (error) {
                      console.error('Error saving to localStorage:', error);
                    }
                    router.push('/form');
                  }}
                  className="mt-4 px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300"
                >
                  Start Now
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </header>
  );
}
