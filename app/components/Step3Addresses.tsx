'use client';

import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useForm } from '../contexts/FormContext';

export function Step3Addresses() {
  const { formData, updateFormData } = useForm();

  const handleSameAsPhysicalChange = (checked: boolean) => {
    if (checked) {
      updateFormData({
        sameAsPhysical: true,
        mailingAddress: formData.physicalAddress,
      });
    } else {
      updateFormData({
        sameAsPhysical: false,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
          Business Addresses
        </h2>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Provide the physical and mailing addresses for your LLC.
        </p>
      </div>

      <div className="space-y-6">
        {/* Physical Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Physical Address (Registered Agent Address)
          </h3>
          
          {/* Registered Agent Service Toggle for Physical Address */}
          <div className="flex items-center gap-3 pb-2">
            <Switch.Root
              checked={formData.physicalRegisteredAgent}
              onCheckedChange={(checked) =>
                updateFormData({ physicalRegisteredAgent: checked })
              }
              className="w-11 h-6 bg-neutral-200 rounded-full relative data-[state=checked]:bg-neutral-900 transition-colors duration-200 outline-none cursor-default focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
            <label className="text-sm font-medium text-neutral-700 cursor-pointer">
              Add professional Registered Agent service.
            </label>
          </div>

          {/* Agent Address Field - shown when toggle is on */}
          {formData.physicalRegisteredAgent ? (
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Agent Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.physicalAgentAddress}
                onChange={(e) =>
                  updateFormData({ physicalAgentAddress: e.target.value })
                }
                placeholder="Enter Registered Agent address"
                disabled={formData.physicalRegisteredAgent}
                className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-neutral-50 cursor-not-allowed opacity-60"
                required
              />
            </div>
          ) : (
            /* Regular Address Fields - shown when toggle is off */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.physicalAddress.street}
                onChange={(e) => {
                  const newPhysicalAddress = {
                    ...formData.physicalAddress,
                    street: e.target.value,
                  };
                  updateFormData({
                    physicalAddress: newPhysicalAddress,
                    mailingAddress: formData.sameAsPhysical
                      ? newPhysicalAddress
                      : formData.mailingAddress,
                  });
                }}
                  placeholder="123 Main Street"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.physicalAddress.city}
                onChange={(e) => {
                  const newPhysicalAddress = {
                    ...formData.physicalAddress,
                    city: e.target.value,
                  };
                  updateFormData({
                    physicalAddress: newPhysicalAddress,
                    mailingAddress: formData.sameAsPhysical
                      ? newPhysicalAddress
                      : formData.mailingAddress,
                  });
                }}
                  placeholder="City"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.physicalAddress.state}
                onChange={(e) => {
                  const newPhysicalAddress = {
                    ...formData.physicalAddress,
                    state: e.target.value,
                  };
                  updateFormData({
                    physicalAddress: newPhysicalAddress,
                    mailingAddress: formData.sameAsPhysical
                      ? newPhysicalAddress
                      : formData.mailingAddress,
                  });
                }}
                  placeholder="State"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.physicalAddress.zip}
                onChange={(e) => {
                  const newPhysicalAddress = {
                    ...formData.physicalAddress,
                    zip: e.target.value,
                  };
                  updateFormData({
                    physicalAddress: newPhysicalAddress,
                    mailingAddress: formData.sameAsPhysical
                      ? newPhysicalAddress
                      : formData.mailingAddress,
                  });
                }}
                  placeholder="12345"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mailing Address */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-neutral-900 mb-3">
            Mailing Address
          </h3>
          
          {/* Registered Agent Service Toggle for Mailing Address */}
          <div className="flex items-center gap-3 pb-2">
            <Switch.Root
              checked={formData.mailingRegisteredAgent}
              onCheckedChange={(checked) =>
                updateFormData({ mailingRegisteredAgent: checked })
              }
              className="w-11 h-6 bg-neutral-200 rounded-full relative data-[state=checked]:bg-neutral-900 transition-colors duration-200 outline-none cursor-default focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
            <label className="text-sm font-medium text-neutral-700 cursor-pointer">
              Add professional Registered Agent service.
            </label>
          </div>

          {/* Agent Address Field - shown when toggle is on */}
          {formData.mailingRegisteredAgent ? (
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Agent Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mailingAgentAddress}
                onChange={(e) =>
                  updateFormData({ mailingAgentAddress: e.target.value })
                }
                placeholder="Enter Registered Agent address"
                disabled={formData.mailingRegisteredAgent}
                className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-neutral-50 cursor-not-allowed opacity-60"
                required
              />
            </div>
          ) : (
            <>
              {/* Use Physical Address Checkbox */}
              <div className="flex items-center gap-3 mb-4">
                <Checkbox.Root
                  checked={formData.sameAsPhysical}
                  onCheckedChange={handleSameAsPhysicalChange}
                  className="w-5 h-5 rounded border-2 border-neutral-300 bg-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-neutral-900 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
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
                <label className="text-sm font-medium text-neutral-700 cursor-pointer">
                  Use physical address
                </label>
              </div>

              {/* Regular Address Fields - shown when toggle is off */}
              {!formData.sameAsPhysical && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mailingAddress.street}
                  onChange={(e) =>
                    updateFormData({
                      mailingAddress: {
                        ...formData.mailingAddress,
                        street: e.target.value,
                      },
                    })
                  }
                  placeholder="123 Main Street"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mailingAddress.city}
                  onChange={(e) =>
                    updateFormData({
                      mailingAddress: {
                        ...formData.mailingAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="City"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mailingAddress.state}
                  onChange={(e) =>
                    updateFormData({
                      mailingAddress: {
                        ...formData.mailingAddress,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="State"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mailingAddress.zip}
                  onChange={(e) =>
                    updateFormData({
                      mailingAddress: {
                        ...formData.mailingAddress,
                        zip: e.target.value,
                      },
                    })
                  }
                  placeholder="12345"
                  className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                  required
                  aria-required="true"
                />
              </div>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

