'use client';

import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useForm } from '../contexts/FormContext';
import { isValidEmail } from '../utils/validation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(
    6,
    10
  )}`;
};

export function Step4Management() {
  const { formData, updateFormData, shouldValidate } = useForm();

  const addOwner = () => {
    updateFormData({
      owners: [
        ...formData.owners,
        { firstName: '', lastName: '', email: '', phone: '', address: '' },
      ],
    });
  };

  const removeOwner = (index: number) => {
    updateFormData({
      owners: formData.owners.filter((_, i) => i !== index),
    });
  };

  const updateOwner = (index: number, field: string, value: string) => {
    const updatedOwners = [...formData.owners];
    // Format phone number if it's the phone field, but keep the raw value for validation
    if (field === 'phone') {
      // Store the formatted value for display, but validation will check the cleaned version
      updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    } else {
      updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    }
    updateFormData({ owners: updatedOwners });
  };

  const addManager = () => {
    updateFormData({
      managers: [
        ...formData.managers,
        { firstName: '', lastName: '', email: '', phone: '', address: '' },
      ],
    });
  };

  const removeManager = (index: number) => {
    updateFormData({
      managers: formData.managers.filter((_, i) => i !== index),
    });
  };

  const updateManager = (index: number, field: string, value: string) => {
    const updatedManagers = [...formData.managers];
    // Format phone number if it's the phone field
    if (field === 'phone') {
      updatedManagers[index] = { ...updatedManagers[index], [field]: formatPhoneNumber(value) };
    } else {
      updatedManagers[index] = { ...updatedManagers[index], [field]: value };
    }
    updateFormData({ managers: updatedManagers });
  };

  // Validation helper for owner
  const isOwnerValid = (owner: typeof formData.owners[0]): boolean => {
    return (
      owner.firstName.trim() !== '' &&
      owner.lastName.trim() !== '' &&
      owner.email.trim() !== '' &&
      isValidEmail(owner.email) &&
      owner.phone.trim() !== '' &&
      owner.address.trim() !== ''
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
          Management Structure
        </h2>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Define how your LLC will be managed and who will be involved.
        </p>
      </div>

      <div className="space-y-6">
        {/* Management Type */}
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-4">
            Management Type <span className="text-red-500">*</span>
          </label>
          <RadioGroup.Root
            value={formData.managementType}
            onValueChange={(value: 'member-managed' | 'manager-managed') =>
              updateFormData({ managementType: value })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <RadioGroup.Item
                value="member-managed"
                id="member-managed"
                className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
              </RadioGroup.Item>
              <label htmlFor="member-managed" className="flex-1 cursor-pointer">
                <div className="font-black text-neutral-900 text-lg">
                  Member-Managed
                </div>
                <div className="text-base text-neutral-600 mt-1">
                  All members participate in management decisions
                </div>
              </label>
            </div>
            <div className="flex items-center space-x-4 p-6 border-2 border-neutral-200 rounded-xl hover:border-neutral-900 cursor-pointer transition-all bg-white">
              <RadioGroup.Item
                value="manager-managed"
                id="manager-managed"
                className="w-5 h-5 rounded-full border-2 border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
              </RadioGroup.Item>
              <label htmlFor="manager-managed" className="flex-1 cursor-pointer">
                <div className="font-black text-neutral-900 text-lg">
                  Manager-Managed
                </div>
                <div className="text-base text-neutral-600 mt-1">
                  Designated managers handle day-to-day operations
                </div>
              </label>
            </div>
          </RadioGroup.Root>
        </div>

        {/* Owners */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-neutral-900 mb-2">
              Owners (Members) <span className="text-red-500">*</span>
            </h3>
            <button
              type="button"
              onClick={addOwner}
              className="px-5 py-3 text-sm font-bold text-neutral-900 hover:text-neutral-700 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all"
            >
              + Add Owner
            </button>
          </div>
          {formData.owners.length === 0 && shouldValidate && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">At least one owner is required</p>
            </div>
          )}
          {formData.owners.map((owner, index) => {
            const ownerValid = isOwnerValid(owner);
            const showOwnerError = shouldValidate && !ownerValid;

            return (
              <div
                key={index}
                className="p-6 border-2 border-neutral-200 rounded-2xl space-y-6 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-neutral-700">
                    Owner {index + 1} <span className="text-red-500">*</span>
                  </span>
                  {formData.owners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOwner(index)}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {showOwnerError && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-amber-800 font-medium">Please fill in all required fields for this owner</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={owner.firstName}
                      onChange={(e) =>
                        updateOwner(index, 'firstName', e.target.value)
                      }
                      placeholder="John"
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={owner.lastName}
                      onChange={(e) =>
                        updateOwner(index, 'lastName', e.target.value)
                      }
                      placeholder="Doe"
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={owner.email}
                      onChange={(e) =>
                        updateOwner(index, 'email', e.target.value)
                      }
                      placeholder="john.doe@example.com"
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                      aria-required="true"
                    />
                    {shouldValidate && owner.email.trim() !== '' && !isValidEmail(owner.email) && (
                      <p className="text-xs text-amber-600 mt-1">Please enter a valid email address</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className={`
                      phone-input-container
                      ${shouldValidate && owner.phone.trim() !== '' && !owner.phone ? 'border-red-500' : 'border-neutral-200 focus-within:border-neutral-900'}
                      border-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all
                    `}>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={owner.phone}
                        onChange={(value) => updateOwner(index, 'phone', value || '')}
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Select your country and enter your phone number</p>
                    {shouldValidate && owner.phone.trim() === '' && (
                      <p className="text-xs text-amber-600 mt-1">Phone number is required</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={owner.address}
                      onChange={(e) =>
                        updateOwner(index, 'address', e.target.value)
                      }
                      placeholder="123 Main St, City, State, ZIP"
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Managers (only if manager-managed) */}
        {formData.managementType === 'manager-managed' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Managers
              </h3>
              <button
                type="button"
                onClick={addManager}
                className="px-5 py-3 text-sm font-bold text-neutral-900 hover:text-neutral-700 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all"
              >
                + Add Manager
              </button>
            </div>
            {formData.managers.length === 0 && (
              <button
                type="button"
                onClick={addManager}
                className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-all font-semibold"
              >
                + Add First Manager
              </button>
            )}
            {formData.managers.map((manager, index) => (
              <div
                key={index}
                className="p-6 border-2 border-neutral-200 rounded-2xl space-y-6 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-neutral-700">
                    Manager {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeManager(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={manager.firstName}
                      onChange={(e) =>
                        updateManager(index, 'firstName', e.target.value)
                      }
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={manager.lastName}
                      onChange={(e) =>
                        updateManager(index, 'lastName', e.target.value)
                      }
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={manager.email}
                      onChange={(e) =>
                        updateManager(index, 'email', e.target.value)
                      }
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className={`
                      phone-input-container
                      ${shouldValidate && manager.phone.trim() !== '' && !manager.phone ? 'border-red-500' : 'border-neutral-200 focus-within:border-neutral-900'}
                      border-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all
                    `}>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={manager.phone}
                        onChange={(value) => updateManager(index, 'phone', value || '')}
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Select your country and enter your phone number</p>
                    {shouldValidate && manager.phone.trim() === '' && (
                      <p className="text-xs text-amber-600 mt-1">Phone number is required</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={manager.address}
                      onChange={(e) =>
                        updateManager(index, 'address', e.target.value)
                      }
                      className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        .phone-input-container .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
          height: 56px;
          padding: 0 20px;
        }
        .phone-input-container .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          padding: 0;
          margin-left: 8px;
          color: #171717;
        }
        .phone-input-container .PhoneInputInput::placeholder {
          color: #a3a3a3;
        }
        .phone-input-container .PhoneInputCountry {
          display: flex;
          align-items: center;
          margin-right: 8px;
          position: relative;
        }
        .phone-input-container .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }
        .phone-input-container .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: none;
          opacity: 0;
          cursor: pointer;
        }
        .phone-input-container .PhoneInputCountrySelectArrow {
          opacity: 0.5;
          margin-left: 4px;
          width: 8px;
          height: 8px;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #737373;
        }
      `}</style>
    </div>
  );
}

