'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useMaintenanceCheck } from '../hooks/useMaintenanceCheck';

interface ContactPageClientProps {
  hideHeaderFooter?: boolean;
}

export function ContactPageClient({ hideHeaderFooter = false }: ContactPageClientProps) {
  useMaintenanceCheck();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setIsSubmitting(false);

        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 5000);
      } else {
        console.error('Contact form error:', data);
        const errorMessage = data?.error || data?.message || 'Failed to send message. Please try again.';
        setError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setError('Failed to send message. Please check your connection and email configuration, then try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-zinc-50">
      {!hideHeaderFooter && <Header onStart={() => window.location.href = '/'} />}

      {/* Hero Section */}
      {!hideHeaderFooter && (
        <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-neutral-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neutral-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full mb-8 shadow-lg border border-neutral-200 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-neutral-700 font-semibold text-sm">24/7 Support Available</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 mb-4 sm:mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 px-4">
                Let's <span className="text-neutral-600">Connect</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 px-4">
                Have questions? We're here to help. Reach out to our expert team and get the support you need.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className={`py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${hideHeaderFooter ? '' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form - Enhanced */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-200 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neutral-100 to-transparent rounded-full blur-3xl -z-0"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-neutral-50 to-transparent rounded-full blur-2xl -z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900">Send us a Message</h2>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1">We typically respond within 24 hours</p>
                  </div>
                </div>

                {isSubmitting ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                      <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-blue-900 mb-2">Sending Your Message...</h3>
                    <p className="text-sm sm:text-base text-blue-800 font-medium text-center px-4">Please wait while we send your message. This may take a few seconds.</p>
                  </div>
                ) : submitted ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-emerald-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-sm sm:text-base text-emerald-800 font-medium text-center mb-2 px-4">We've received your message and will get back to you soon.</p>
                    <p className="text-xs sm:text-sm text-emerald-700 text-center px-4">A confirmation email has been sent to your email address.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                        <p className="font-bold text-sm">{error}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold text-neutral-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full h-14 pl-12 pr-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-2">
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
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full h-14 pl-12 pr-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-14 pl-12 pr-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-neutral-700 mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                            className="w-full h-14 pl-12 pr-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-neutral-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="w-full px-5 py-4 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all resize-none text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                          placeholder="Tell us more about your inquiry..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                          {formData.message.length} / 1000
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full h-14 bg-neutral-900 text-white font-black rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-neutral-800'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information - Enhanced */}
            {!hideHeaderFooter && (
              <div className="space-y-6">
                {/* Phone Card */}
                <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-100 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-neutral-900 mb-2">Phone Support</h3>
                        <a href={`tel:${contactInfo.phoneNumber}`} className="text-lg sm:text-xl md:text-2xl text-neutral-700 font-bold hover:text-neutral-900 transition-colors block mb-2 break-all">
                          {contactInfo.phoneDisplay}
                        </a>
                        <p className="text-xs sm:text-sm text-neutral-500 font-medium">{contactInfo.businessHours}</p>
                        <p className="text-xs text-neutral-400 mt-2">Click to call</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-100 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-neutral-900 mb-2">Email Us</h3>
                        <a href={`mailto:${contactInfo.supportEmail}`} className="text-base sm:text-lg md:text-xl text-neutral-700 font-bold hover:text-neutral-900 transition-colors block mb-2 break-all">
                          {contactInfo.supportEmail}
                        </a>
                        <p className="text-xs sm:text-sm text-neutral-500 font-medium">We respond within 24 hours</p>
                        <p className="text-xs text-neutral-400 mt-2">Click to email</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                {(contactInfo.streetAddress || contactInfo.city) && (
                  <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-100 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-neutral-900 mb-2 sm:mb-3">Visit Us</h3>
                          {contactInfo.streetAddress && (
                            <p className="text-sm sm:text-base md:text-lg text-neutral-700 font-semibold mb-1">{contactInfo.streetAddress}</p>
                          )}
                          {contactInfo.addressLine2 && (
                            <p className="text-sm sm:text-base md:text-lg text-neutral-700 font-semibold mb-2">{contactInfo.addressLine2}</p>
                          )}
                          {(contactInfo.city || contactInfo.state || contactInfo.zipCode) && (
                            <p className="text-sm sm:text-base md:text-lg text-neutral-700 font-semibold mb-1">
                              {[contactInfo.city, contactInfo.state, contactInfo.zipCode].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {contactInfo.country && (
                            <p className="text-sm sm:text-base md:text-lg text-neutral-700 font-semibold">{contactInfo.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!hideHeaderFooter && (
        <>
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-4">
                Ready to Get Started?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                Start your LLC formation process today with our simple, secure platform.
              </p>
              <Link
                href="/"
                className="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-neutral-900 font-black rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg"
              >
                Start Your LLC Today
              </Link>
            </div>
          </section>
          <Footer onStart={() => window.location.href = '/'} />
        </>
      )}
    </div>
  );
}


