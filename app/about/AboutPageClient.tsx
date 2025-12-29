'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useMaintenanceCheck } from '../hooks/useMaintenanceCheck';

export function AboutPageClient() {
  useMaintenanceCheck();
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-zinc-50">
      <Header onStart={() => window.location.href = '/'} />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6 border border-neutral-200">
              <span className="text-neutral-700 font-semibold text-sm">About Us</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-neutral-900 mb-4 sm:mb-6 tracking-tight px-4">
              Your Partner in <span className="text-neutral-600">Business Formation</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
              We are committed to making LLC registration simple, transparent, and accessible for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-neutral-700 mb-4 sm:mb-6 leading-relaxed">
                At Swift Filling, we believe in empowering entrepreneurs and business owners to achieve their dreams. Our mission is to make LLC formation accessible, affordable, and completely stress-free. We've built a platform that demystifies the complex process of forming a Limited Liability Company, providing you with professional-grade tools, expert guidance, and comprehensive support every step of the way.
              </p>
              <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                With over a decade of experience in business formation across all 50 states, we pride ourselves on our accuracy, efficiency, and unwavering commitment to customer success. Our team of business formation specialists understands the nuances of state-specific requirements and regulations. We handle all the complexities, paperwork, and compliance requirements so you can focus on what truly matters—building and growing your business.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-200 shadow-inner">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-1 sm:mb-2">10+</div>
                  <div className="text-sm sm:text-base text-neutral-700 font-semibold">Years Experience</div>
                </div>
                <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-200 shadow-inner">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-1 sm:mb-2">50+</div>
                  <div className="text-sm sm:text-base text-neutral-700 font-semibold">States Covered</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-3xl p-10 shadow-xl border border-neutral-200">
              <h3 className="text-3xl font-black text-neutral-900 mb-8">Our Values</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-900 mb-2 text-lg">Transparency</h4>
                    <p className="text-neutral-600 leading-relaxed">No hidden fees, no surprises. We provide clear, upfront pricing with complete transparency. You'll know exactly what you're paying before you commit, including all state filing fees. Honest communication is at the core of everything we do.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-900 mb-2 text-lg">Excellence</h4>
                    <p className="text-neutral-600 leading-relaxed">We strive for perfection in every LLC formation we handle. Every application is carefully reviewed by our expert team to ensure 100% accuracy and compliance. We take pride in getting it right the first time, every time. Your success is our success.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-900 mb-2 text-lg">Customer First</h4>
                    <p className="text-neutral-600 leading-relaxed">Your success is our success. We're committed to providing exceptional customer service and support throughout your entire journey. From initial formation to ongoing compliance, we're here for you every step of the way with expert guidance and responsive support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-3 sm:mb-4 px-4">
              Why Choose <span className="text-neutral-600">Swift Filling</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
              Everything you need to form your LLC quickly and securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-neutral-900 mb-2 sm:mb-3">Fast & Efficient Processing</h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Get your LLC formed quickly with our streamlined, efficient process. Most formations are completed within 5-10 business days, with expedited options available for faster processing when needed.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-3">Enterprise-Grade Security</h3>
              <p className="text-neutral-700 leading-relaxed">
                Your sensitive business information is protected with bank-level encryption, secure data storage, and industry-standard security protocols. We take data privacy and security seriously.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-3">Expert Support Team</h3>
              <p className="text-neutral-700 leading-relaxed">
                Our dedicated team of business formation specialists is available to guide you through every step of the process. Get expert answers to your questions and professional assistance when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-4">
            Ready to Form Your LLC?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join thousands of entrepreneurs who trusted Swift Filling to start their business.
          </p>
          <Link
            href="/"
            className="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-neutral-900 font-black rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg"
          >
            Start Your LLC Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}


