'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart?: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const router = useRouter();
  
  // Default handler if onStart is not provided
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-zinc-50">
      <Header onStart={handleStart} />

      {/* Hero Section */}
      <section id="home" className="relative pt-24 sm:pt-32 pb-16 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full mb-8 border border-neutral-200 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-neutral-700 font-medium text-sm">Trusted by 10,000+ Businesses</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tight">
              <span className="block text-neutral-900 leading-tight">Form Your LLC</span>
              <span className="block text-neutral-600 leading-tight mt-1 sm:mt-2">Fast, Easy & Professional</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Start your business with confidence. We handle all the paperwork, filing, and compliance requirements so you can focus on what matters most—growing your business.
              <br className="hidden sm:block" />
              <span className="text-neutral-500">Trusted by thousands of entrepreneurs nationwide.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleStart}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <button
                onClick={() => {
                  const element = document.getElementById('about');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-neutral-200 text-neutral-700 text-sm sm:text-base font-bold rounded-xl hover:border-neutral-300 hover:bg-neutral-50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators - Neumorphic Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-neutral-100">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-1 sm:mb-2">10K+</div>
                <div className="text-sm sm:text-base text-neutral-600 font-medium">LLCs Formed</div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-neutral-100">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-1 sm:mb-2">4.9</div>
                <div className="text-sm sm:text-base text-neutral-600 font-medium">Rating</div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-neutral-100">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-1 sm:mb-2">99%</div>
                <div className="text-sm sm:text-base text-neutral-600 font-medium">Success</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6 border border-neutral-200">
              <span className="text-neutral-700 font-semibold text-sm">Why Choose Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-4 tracking-tight px-4">
              Professional Service You Can Trust
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Everything you need for a successful LLC formation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 mb-2 sm:mb-3">Fast & Reliable Processing</h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Get your LLC formed quickly with our streamlined process. Most formations are completed within 5-7 business days, with expedited options available for faster processing.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Enterprise-Grade Security</h3>
              <p className="text-neutral-600 leading-relaxed">
                Your sensitive business information is protected with bank-level encryption, secure data storage, and industry-standard security protocols. Your privacy is our priority.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Dedicated Expert Support</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our experienced business formation specialists are available to answer your questions and guide you through every step of the process. Get expert help when you need it.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">100% Accuracy Guarantee</h3>
              <p className="text-neutral-600 leading-relaxed">
                Every application is carefully reviewed by our expert team to ensure complete accuracy and full compliance with all state requirements. We stand behind our work.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Transparent Pricing</h3>
              <p className="text-neutral-600 leading-relaxed">
                No hidden fees or surprises. You'll see exactly what you're paying upfront with clear, transparent pricing. State filing fees are clearly displayed before you commit.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">All 50 States Supported</h3>
              <p className="text-neutral-600 leading-relaxed">
                We handle LLC formations in all 50 states plus Washington D.C. Our team has expert knowledge of state-specific requirements, regulations, and filing procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-neutral-200 rounded-full mb-4">
                <span className="text-neutral-700 font-semibold text-sm">About Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                Your Trusted
                <br />
                <span className="text-neutral-600">Partner</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 leading-relaxed">
                We've been helping entrepreneurs and business owners form their LLCs for over a decade. 
                Our mission is to make business formation fast, affordable, and completely stress-free.
              </p>
              <p className="text-base text-neutral-600 mb-8 leading-relaxed">
                With thousands of successful formations across all 50 states, we have the experience and expertise to ensure your LLC is formed correctly the first time. Our team of business formation specialists understands the nuances of each state's requirements.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-neutral-200 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-black text-neutral-900 mb-1">10+</div>
                  <div className="text-sm sm:text-base text-neutral-600 font-semibold">Years</div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-neutral-200 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-black text-neutral-900 mb-1">50+</div>
                  <div className="text-sm sm:text-base text-neutral-600 font-semibold">States</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg">
                <h3 className="text-2xl font-black text-neutral-900 mb-6">Our Values</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-black text-neutral-900 mb-1 text-lg">Transparency</h4>
                      <p className="text-neutral-600">No hidden fees, clear pricing, honest communication.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-black text-neutral-900 mb-1 text-lg">Excellence</h4>
                      <p className="text-neutral-600">We strive for perfection in every formation.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-black text-neutral-900 mb-2 text-xl">Customer First</h4>
                      <p className="text-neutral-600 text-lg">Your success is our success.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6 border border-neutral-200">
              <span className="text-neutral-700 font-semibold text-sm">Simple Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-4 tracking-tight px-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Form your LLC in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-black text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 mb-2 sm:mb-3">Choose Your State</h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Select the state where you want to form your LLC. We handle all 50 states.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-black text-white">2</span>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Fill Your Details</h3>
              <p className="text-neutral-600 leading-relaxed">
                Provide your company information, addresses, and management details securely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Review & Submit</h3>
              <p className="text-neutral-600 leading-relaxed">
                Review your information and submit. Our experts verify everything.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-black text-white">4</span>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Get Your LLC</h3>
              <p className="text-neutral-600 leading-relaxed">
                Receive your LLC documents and start operating your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-4 tracking-tight px-4">
              Why Form an LLC?
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Protect your personal assets and grow your business with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 mb-2 sm:mb-3">Asset Protection</h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Separate your personal assets from your business liabilities. Your home, car, and savings stay protected.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Tax Benefits</h3>
              <p className="text-neutral-600 leading-relaxed">
                Enjoy flexible tax options. Choose how you want to be taxed and potentially save on your tax bill.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Credibility</h3>
              <p className="text-neutral-600 leading-relaxed">
                Build trust with customers, partners, and investors. An LLC shows you're serious about your business.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Flexibility</h3>
              <p className="text-neutral-600 leading-relaxed">
                Operate with fewer formalities than a corporation. More freedom in how you run your business.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Multiple Owners</h3>
              <p className="text-neutral-600 leading-relaxed">
                Easily add partners or members. Perfect for businesses with multiple owners or investors.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Quick Setup</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get your LLC formed in days, not weeks. Start operating your business faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6 border border-neutral-200">
              <span className="text-neutral-700 font-semibold text-sm">Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-4 tracking-tight px-4">
              What Our Clients Say
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Join thousands of satisfied business owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed italic">
                "Swift Filling made the entire process seamless. From start to finish, everything was clear and straightforward. My LLC was formed faster than I expected, and the customer support team answered all my questions promptly. Highly recommend!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white font-black">
                  SM
                </div>
                <div>
                  <div className="font-black text-neutral-900">Sarah Martinez</div>
                  <div className="text-sm text-neutral-600">Tech Startup Founder, California</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed italic">
                "As a first-time business owner, I was overwhelmed by the legal requirements. Swift Filling's team walked me through every step, answered all my questions, and made the process stress-free. The online dashboard made it easy to track my application status. Excellent service!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white font-black">
                  JD
                </div>
                <div>
                  <div className="font-black text-neutral-900">James Davis</div>
                  <div className="text-sm text-neutral-600">Business Consultant, Texas</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed italic">
                "Professional, efficient, and reliable. I've used Swift Filling for multiple LLC formations and they've never disappointed. The pricing is transparent, the process is smooth, and the support team is knowledgeable. I've recommended them to several colleagues who all had equally positive experiences."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white font-black">
                  EW
                </div>
                <div>
                  <div className="font-black text-neutral-900">Emily Wilson</div>
                  <div className="text-sm text-neutral-600">E-commerce Entrepreneur, New York</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-4 tracking-tight px-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 px-4">
              Everything you need to know about forming an LLC
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 mb-2 sm:mb-3">What is an LLC and why should I form one?</h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                A Limited Liability Company (LLC) is a popular business structure that combines the liability protection of a corporation with the flexibility and tax benefits of a partnership. It protects your personal assets (home, car, savings) from business debts and lawsuits, while offering pass-through taxation and fewer formalities than a corporation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-black text-neutral-900 mb-3">How long does it take to form an LLC?</h3>
              <p className="text-neutral-600 leading-relaxed">
                Processing times vary by state, typically ranging from 1-2 business days (expedited) to 2-4 weeks (standard processing). Most states process LLC formations within 5-10 business days. We'll keep you updated throughout the entire process via email and your dashboard.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-black text-neutral-900 mb-3">Do I need a Registered Agent?</h3>
              <p className="text-neutral-600 leading-relaxed">
                Yes, all LLCs are legally required to have a Registered Agent in the state where they're formed. The Registered Agent receives important legal documents, tax notices, and service of process on behalf of your business. The agent must have a physical address in the state and be available during business hours. We can help you set up professional Registered Agent services if needed.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-black text-neutral-900 mb-3">What information do I need to form an LLC?</h3>
              <p className="text-neutral-600 leading-relaxed">
                You'll need: your desired LLC name (we'll check availability), business purpose, principal business address, mailing address, management structure (member-managed or manager-managed), names and addresses of all members/managers, and contact information. Our step-by-step online process guides you through providing all required information easily and securely.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-black text-neutral-900 mb-3">Can I form an LLC in a different state than where I live?</h3>
              <p className="text-neutral-600 leading-relaxed">
                Yes, you can form an LLC in any state, regardless of where you live. Many businesses choose states like Delaware, Wyoming, or Nevada for their business-friendly laws and tax advantages. However, if you form in one state but operate in another, you'll typically need to register as a "foreign LLC" in your home state, which may involve additional fees and requirements.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-black text-neutral-900 mb-3">What are the costs involved in forming an LLC?</h3>
              <p className="text-neutral-600 leading-relaxed">
                The total cost includes our service fee plus your state's filing fee (which varies by state, typically $50-$500). Some states also require annual report fees. We display all fees upfront before you commit, with no hidden charges. Additional services like EIN application, Operating Agreement, or Registered Agent services are optional and clearly priced.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-black text-neutral-900 mb-3">What happens after my LLC is formed?</h3>
              <p className="text-neutral-600 leading-relaxed">
                Once your LLC is approved by the state, you'll receive your Articles of Organization and can begin operating. You may need to obtain an EIN from the IRS, create an Operating Agreement, open a business bank account, and obtain necessary business licenses. We provide guidance on these next steps and can help with additional services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6 border border-neutral-200">
              <span className="text-neutral-700 font-semibold text-sm">Resources</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-4 tracking-tight px-4">
              Everything You Need to Know
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Expert guides and resources to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900 mb-2 sm:mb-3">LLC Formation Guide</h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-3 sm:mb-4">
                Complete step-by-step guide to forming your LLC, including state-specific requirements and best practices.
              </p>
              <a 
                href="/resources/llc-formation-guide.pdf" 
                download="LLC-Formation-Guide.pdf"
                className="text-neutral-900 font-bold hover:underline inline-flex items-center gap-2 group"
              >
                Read Guide
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Operating Agreement Template</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Free template to create your LLC Operating Agreement. Essential for multi-member LLCs.
              </p>
              <a 
                href="/resources/operating-agreement-template.pdf" 
                download="Operating-Agreement-Template.pdf"
                className="text-neutral-900 font-bold hover:underline inline-flex items-center gap-2 group"
              >
                Download Template
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">Compliance Calendar</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Stay on top of important deadlines with our compliance calendar. Never miss a filing date.
              </p>
              <a 
                href="/resources/compliance-calendar.pdf" 
                download="Compliance-Calendar.pdf"
                className="text-neutral-900 font-bold hover:underline inline-flex items-center gap-2 group"
              >
                View Calendar
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 tracking-tight px-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 mb-8 sm:mb-10 font-light px-4">
            Join thousands of successful businesses today.
          </p>
          <button
            onClick={onStart}
            className="px-10 py-4 bg-white text-neutral-900 font-black rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>

      <Footer onStart={handleStart} />
    </div>
  );
}
