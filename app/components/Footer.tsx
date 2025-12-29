'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FooterProps {
  onStart?: () => void;
}

export function Footer({ onStart }: FooterProps) {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: '18007943835',
    phoneDisplay: '1-800-SWIFT-FILL',
    supportEmail: 'support@swiftsfilling.com',
    businessHours: 'Mon-Fri 9AM-6PM EST',
    streetAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const response = await fetch('/api/contact-settings');
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error);
      }
    };
    fetchContactSettings();
  }, []);

  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      // Default behavior: navigate to form
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('swift_filling_has_started', JSON.stringify(true));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      router.push('/form');
    }
  };
  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-300 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neutral-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Swift <span className="text-neutral-300">Filling</span>
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-neutral-100 to-transparent rounded-full -mt-0.5"></div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-light">
              Professional LLC registration service trusted by thousands of businesses.
              Fast, secure, and reliable formation services with expert support available 24/7.
            </p>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 tracking-tight">Quick Links</h4>
              <div className="w-12 h-0.5 bg-gradient-to-r from-neutral-100 to-transparent rounded-full mb-4"></div>
            </div>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="group flex items-center text-neutral-400 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="group flex items-center text-neutral-400 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center text-neutral-400 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact Us</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleStart}
                  className="group flex items-center text-neutral-400 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Start Registration</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 tracking-tight">Contact</h4>
              <div className="w-12 h-0.5 bg-gradient-to-r from-neutral-100 to-transparent rounded-full mb-4"></div>
            </div>
            <ul className="space-y-5">
              <li className="group">
                <a href={`mailto:${contactInfo.supportEmail}`} className="flex items-start gap-4 text-neutral-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-neutral-800/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-neutral-700/50 group-hover:border-neutral-100 group-hover:bg-neutral-700/50 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-sm sm:text-base">{contactInfo.supportEmail}</span>
                    <span className="text-xs text-neutral-500 mt-1">Click to email</span>
                  </div>
                </a>
              </li>
              <li className="group">
                <a href={`tel:${contactInfo.phoneNumber}`} className="flex items-start gap-4 text-neutral-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-neutral-800/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-neutral-700/50 group-hover:border-neutral-100 group-hover:bg-neutral-700/50 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-sm sm:text-base">{contactInfo.phoneDisplay}</span>
                    <span className="text-xs text-neutral-500 mt-1">{contactInfo.businessHours}</span>
                  </div>
                </a>
              </li>
              {(contactInfo.streetAddress || contactInfo.city) && (
                <li className="group">
                  <div className="flex items-start gap-4 text-neutral-400">
                    <div className="w-10 h-10 bg-neutral-800/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-neutral-700/50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      {contactInfo.streetAddress && (
                        <span className="block font-medium text-sm sm:text-base">{contactInfo.streetAddress}</span>
                      )}
                      {contactInfo.addressLine2 && (
                        <span className="block font-medium text-sm sm:text-base">{contactInfo.addressLine2}</span>
                      )}
                      {(contactInfo.city || contactInfo.state || contactInfo.zipCode) && (
                        <span className="block font-medium text-sm sm:text-base">
                          {[contactInfo.city, contactInfo.state, contactInfo.zipCode].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {contactInfo.country && (
                        <span className="block font-medium text-sm sm:text-base">{contactInfo.country}</span>
                      )}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="border-t border-neutral-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <p className="text-neutral-500 text-sm font-medium">
                © 2024 Swift Filling. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors font-medium relative group"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors font-medium relative group"
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors font-medium relative group"
              >
                Cookie Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

