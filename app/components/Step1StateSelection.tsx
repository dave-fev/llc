'use client';

import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { useForm } from '../contexts/FormContext';

const US_STATES = [
  { code: 'AL', name: 'Alabama', fee: 200 },
  { code: 'AK', name: 'Alaska', fee: 250 },
  { code: 'AZ', name: 'Arizona', fee: 50 },
  { code: 'AR', name: 'Arkansas', fee: 50 },
  { code: 'CA', name: 'California', fee: 70 },
  { code: 'CO', name: 'Colorado', fee: 50 },
  { code: 'CT', name: 'Connecticut', fee: 120 },
  { code: 'DE', name: 'Delaware', fee: 90 },
  { code: 'FL', name: 'Florida', fee: 125 },
  { code: 'GA', name: 'Georgia', fee: 100 },
  { code: 'HI', name: 'Hawaii', fee: 50 },
  { code: 'ID', name: 'Idaho', fee: 100 },
  { code: 'IL', name: 'Illinois', fee: 150 },
  { code: 'IN', name: 'Indiana', fee: 90 },
  { code: 'IA', name: 'Iowa', fee: 50 },
  { code: 'KS', name: 'Kansas', fee: 165 },
  { code: 'KY', name: 'Kentucky', fee: 40 },
  { code: 'LA', name: 'Louisiana', fee: 75 },
  { code: 'ME', name: 'Maine', fee: 175 },
  { code: 'MD', name: 'Maryland', fee: 100 },
  { code: 'MA', name: 'Massachusetts', fee: 500 },
  { code: 'MI', name: 'Michigan', fee: 50 },
  { code: 'MN', name: 'Minnesota', fee: 135 },
  { code: 'MS', name: 'Mississippi', fee: 50 },
  { code: 'MO', name: 'Missouri', fee: 50 },
  { code: 'MT', name: 'Montana', fee: 70 },
  { code: 'NE', name: 'Nebraska', fee: 100 },
  { code: 'NV', name: 'Nevada', fee: 75 },
  { code: 'NH', name: 'New Hampshire', fee: 100 },
  { code: 'NJ', name: 'New Jersey', fee: 125 },
  { code: 'NM', name: 'New Mexico', fee: 50 },
  { code: 'NY', name: 'New York', fee: 200 },
  { code: 'NC', name: 'North Carolina', fee: 125 },
  { code: 'ND', name: 'North Dakota', fee: 100 },
  { code: 'OH', name: 'Ohio', fee: 99 },
  { code: 'OK', name: 'Oklahoma', fee: 100 },
  { code: 'OR', name: 'Oregon', fee: 100 },
  { code: 'PA', name: 'Pennsylvania', fee: 125 },
  { code: 'RI', name: 'Rhode Island', fee: 150 },
  { code: 'SC', name: 'South Carolina', fee: 110 },
  { code: 'SD', name: 'South Dakota', fee: 150 },
  { code: 'TN', name: 'Tennessee', fee: 300 },
  { code: 'TX', name: 'Texas', fee: 300 },
  { code: 'UT', name: 'Utah', fee: 70 },
  { code: 'VT', name: 'Vermont', fee: 125 },
  { code: 'VA', name: 'Virginia', fee: 100 },
  { code: 'WA', name: 'Washington', fee: 200 },
  { code: 'WV', name: 'West Virginia', fee: 100 },
  { code: 'WI', name: 'Wisconsin', fee: 130 },
  { code: 'WY', name: 'Wyoming', fee: 60 },
  { code: 'DC', name: 'District of Columbia', fee: 220 },
];

export function Step1StateSelection() {
  const { formData, updateFormData, shouldValidate } = useForm();
  const [isMounted, setIsMounted] = useState(false);
  const selectedState = US_STATES.find((s) => s.code === formData.state);
  const isValid = formData.state !== '' && formData.state.trim() !== '';
  const showError = shouldValidate && !isValid;

  // Prevent hydration mismatch by only rendering Select after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
          Select Your State
        </h2>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Choose the state where you want to form your LLC. State filing fees are included.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-neutral-700 mb-2">
          State of Formation <span className="text-red-500">*</span>
        </label>
        {!isMounted ? (
          // Placeholder during SSR to match client render
          <div className="w-full h-14 px-5 bg-white border-2 border-neutral-200 rounded-xl flex items-center justify-between text-left text-neutral-400 shadow-sm">
            <span>Select a state</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-neutral-600">
              <path
                d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.64245 9.99394 7.35753 9.99394 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                fill="currentColor"
              />
            </svg>
          </div>
        ) : (
          <Select.Root
            value={formData.state || undefined}
            onValueChange={(value) => {
              const state = US_STATES.find((s) => s.code === value);
              updateFormData({
                state: value,
                stateFee: state?.fee || 0,
              });
            }}
            required
          >
            <Select.Trigger 
              className="w-full h-14 px-5 bg-white border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none flex items-center justify-between text-left text-black shadow-sm hover:shadow-md transition-all"
              aria-required="true"
            >
              <Select.Value placeholder="Select a state" className="text-black placeholder:text-neutral-400" />
              <Select.Icon className="text-neutral-600">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.64245 9.99394 7.35753 9.99394 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                    fill="currentColor"
                  />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-h-[300px] overflow-y-auto z-50 min-w-[var(--radix-select-trigger-width)]">
                <Select.Viewport className="p-2">
                  {US_STATES.map((state) => (
                    <Select.Item
                      key={state.code}
                      value={state.code}
                      className="px-4 py-3 hover:bg-neutral-50 focus:bg-neutral-50 cursor-pointer flex items-center rounded-lg transition-all"
                    >
                      <Select.ItemText>
                        <span className="text-black font-semibold">{state.name}</span>
                      </Select.ItemText>
                      <Select.ItemIndicator className="ml-2">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path
                            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
        {showError && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-800 font-medium">Please select a state to continue</p>
          </div>
        )}
      </div>

      {isMounted && selectedState && (
        <div className="p-6 bg-neutral-50 border-2 border-neutral-200 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-neutral-900">
                {selectedState.name} Filing Fee
              </p>
              <p className="text-sm text-neutral-600 mt-1 font-medium">
                This fee is paid directly to the state
              </p>
            </div>
            <div className="text-2xl font-black text-neutral-900">
              ${selectedState.fee}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

