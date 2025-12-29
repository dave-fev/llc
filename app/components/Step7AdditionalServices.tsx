'use client';

import React, { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useForm } from '../contexts/FormContext';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'ein',
    name: 'EIN (Employer Identification Number)',
    description: 'Get your federal tax ID number for business operations',
    price: 79,
  },
  {
    id: 'website',
    name: 'Professional Website',
    description: 'Custom business website with domain and hosting (1 year)',
    price: 299,
  },
  {
    id: 'itin',
    name: 'ITIN Application',
    description: 'Individual Taxpayer Identification Number for non-residents',
    price: 149,
  },
  {
    id: 'branding',
    name: 'Branding Package',
    description: 'Logo design, business cards, and brand guidelines',
    price: 399,
  },
];

export function Step7AdditionalServices() {
  const { formData, updateFormData } = useForm();
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const toggleService = (serviceId: keyof typeof formData.additionalServices) => {
    updateFormData({
      additionalServices: {
        ...formData.additionalServices,
        [serviceId]: !formData.additionalServices[serviceId],
      },
    });
  };

  const selectedServices = services.filter(
    (service) => formData.additionalServices[service.id as keyof typeof formData.additionalServices]
  );
  const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
            Additional Services
          </h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
          Additional Services
        </h2>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Enhance your LLC with these optional services. You can add them now or later.
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-8 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${formData.additionalServices[service.id as keyof typeof formData.additionalServices]
                ? 'border-neutral-900 bg-neutral-50 shadow-xl'
                : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg bg-white'
              }`}
            onClick={() => toggleService(service.id as keyof typeof formData.additionalServices)}
          >
            <div className="flex items-start space-x-4">
              <Checkbox.Root
                checked={formData.additionalServices[service.id as keyof typeof formData.additionalServices]}
                onCheckedChange={() => toggleService(service.id as keyof typeof formData.additionalServices)}
                className="mt-1 w-6 h-6 rounded border-2 border-neutral-300 bg-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-neutral-900 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900 flex-shrink-0"
              >
                <Checkbox.Indicator>
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                      fill="white"
                    />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-neutral-900 text-lg">{service.name}</h3>
                  <span className="text-2xl font-black text-neutral-900">
                    ${service.price}
                  </span>
                </div>
                <p className="text-base text-neutral-600">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-6 p-6 bg-neutral-50 border-2 border-neutral-200 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-black text-neutral-900">
                Additional Services Total
              </p>
              <p className="text-sm text-neutral-600 mt-1 font-medium">
                {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
              </p>
            </div>
            <div className="text-2xl font-black text-neutral-900">
              ${servicesTotal}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

