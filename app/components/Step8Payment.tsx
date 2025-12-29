'use client';

import React, { useState, useEffect } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useForm } from '../contexts/FormContext';
import { Loader2, Shield, Lock, CheckCircle2, CreditCard, Sparkles, X } from 'lucide-react';

const BASE_SERVICE_FEE = 39;
const PROCESSING_FEE = 5;

// Declare ChapaCheckout type for TypeScript
declare global {
  interface Window {
    ChapaCheckout: any;
  }
}

interface Service {
  id: string;
  name: string;
  price: number;
}

const DEFAULT_SERVICES: Service[] = [
  { id: 'ein', name: 'EIN', price: 79 },
  { id: 'website', name: 'Professional Website', price: 299 },
  { id: 'itin', name: 'ITIN Application', price: 149 },
  { id: 'branding', name: 'Branding Package', price: 399 },
];

export function Step8Payment() {
  const { formData } = useForm();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            setServices(data.services);
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Keep default services on error
      }
    };
    fetchServices();
  }, []);

  const selectedServices = services.filter((service) =>
    formData.additionalServices[service.id as keyof typeof formData.additionalServices]
  );

  const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const subtotal = BASE_SERVICE_FEE + formData.stateFee + servicesTotal;
  const total = subtotal + PROCESSING_FEE;

  // Load Chapa inline script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.ChapaCheckout) {
      const script = document.createElement('script');
      script.src = 'https://js.chapa.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Generate unique transaction reference
  const generateTxRef = () => {
    return `SWIFT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  };

  const handleChapaPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Get customer email from form data
      const customerEmail = formData.accountEmail || formData.contactEmail;
      const firstName = formData.owners[0]?.firstName || 'Customer';
      const lastName = formData.owners[0]?.lastName || '';

      if (!customerEmail) {
        setError('Please provide an email address in the account section');
        setIsProcessing(false);
        return;
      }

      // Generate transaction reference
      const txRef = generateTxRef();

      // Get base URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

      // Save order to database before payment
      console.log('Saving order to database...');
      const saveResponse = await fetch('/api/orders/save-from-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txRef,
          formData,
          amount: total,
          suppressEmails: true,
        }),
      });

      if (!saveResponse.ok) {
        let errorMessage = 'Failed to save order information.';
        try {
          const contentType = saveResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await saveResponse.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await saveResponse.text();
            // If text is huge (HTML), truncate it
            errorMessage = text.length > 200 ? text.substring(0, 200) + '...' : (text || saveResponse.statusText);
          }
        } catch (e) {
          console.error('Error parsing save error response:', e);
        }
        console.error('Failed to save order:', errorMessage);
        throw new Error(errorMessage + ' Please try again or contact support.');
      }
      console.log('Order saved successfully');

      // Initialize payment with Chapa
      const response = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          email: customerEmail,
          firstName: firstName,
          lastName: lastName,
          txRef: txRef,
          callbackUrl: `${baseUrl}/api/chapa/callback`,
          returnUrl: `${baseUrl}/payment/success?tx_ref=${txRef}`,
        }),
      });

      // Safely parse JSON response
      let data;
      const contentType = response.headers.get('content-type');
      console.log('Response details:', {
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        ok: response.ok
      });

      try {
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          console.log('Response text:', text);
          data = text ? JSON.parse(text) : {};
        } else {
          const text = await response.text();
          console.log('Non-JSON response text:', text);
          data = { error: text || 'Unknown error' };
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        data = { error: 'Failed to parse server response' };
      }

      console.log('Parsed data:', data);

      if (!response.ok) {
        // Handle error message - could be string or object
        let errorMessage = `Failed to initialize payment (Status: ${response.status})`;

        if (data && typeof data === 'object') {
          if (data.error) {
            if (typeof data.error === 'object') {
              // Handle validation error objects like { field: ["message"] }
              const messages = Object.values(data.error).flat();
              errorMessage = messages.length > 0 ? messages.join(', ') : JSON.stringify(data.error);
            } else {
              errorMessage = String(data.error);
            }
          } else if (data.message) {
            errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
          }
        }

        console.error('Payment initialization FAILED:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: response.url
        });

        // Use a descriptive error message
        throw new Error(errorMessage);
      }

      // Redirect to Chapa checkout
      if (data && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL received from payment gateway');
      }
    } catch (err: any) {
      console.error('Payment error detail:', err);

      let errorMessage = 'Failed to process payment. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage = err.message || JSON.stringify(err);
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header - Transparent & Integrated */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-neutral-900 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-neutral-900 tracking-tight">Secure Checkout</h2>
            <p className="text-neutral-500 font-medium text-[11px] md:text-xs">Finalize your formation through our secure gateway.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-50 rounded-full border border-neutral-100">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Encypted</span>
        </div>
      </div>

      <div className="space-y-10">
        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Main Services */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-400" />
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Formation Services</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-neutral-100 shadow-sm hover:border-neutral-900 transition-all">
                <span className="text-neutral-600 font-bold text-sm">LLC Formation</span>
                <span className="font-black text-neutral-900 text-base">${BASE_SERVICE_FEE}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-neutral-100 shadow-sm hover:border-neutral-900 transition-all">
                <span className="text-neutral-600 font-bold text-sm">{formData.state} Filing Fee</span>
                <span className="font-black text-neutral-900 text-base">${formData.stateFee}</span>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-400" />
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Selected Add-ons</h3>
            </div>
            <div className="space-y-2">
              {selectedServices.length > 0 ? (
                selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-neutral-100 shadow-sm hover:border-neutral-900 transition-all">
                    <span className="text-neutral-600 font-bold text-sm">{service.name}</span>
                    <span className="font-black text-neutral-900 text-base">${service.price}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-neutral-50 rounded-xl text-center">
                  <p className="text-neutral-400 text-xs font-medium italic">No extras selected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Row - Highly Professional & Compact */}
        <div className="pt-8 border-t border-neutral-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-neutral-900 rounded-xl shadow-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Grand Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black text-neutral-900">${total}</span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">USD</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto space-y-3 flex flex-col items-center lg:items-end">
              <button
                onClick={handleChapaPayment}
                disabled={isProcessing}
                className="group relative w-full sm:w-[280px] h-14 bg-neutral-900 text-white font-black rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s]"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm uppercase tracking-widest">Complete Payment</span>
                      <Lock className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </div>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">Redirecting to Chapa Gateway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in shake">
            <div className="flex items-center gap-3">
              <X className="w-4 h-4 text-red-500" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Support Trigger */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-neutral-400 font-medium italic">
          Need help? Contact our experts at <span className="text-neutral-900 font-black">support@swiftsfilling.com</span>
        </p>
      </div>
    </div>
  );
}

