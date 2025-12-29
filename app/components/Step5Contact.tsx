'use client';

import React from 'react';
import { useForm } from '../contexts/FormContext';
import { isValidEmail } from '../utils/validation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export function Step5Contact() {
  const { formData, updateFormData, shouldValidate } = useForm();
  
  const emailValid = formData.contactEmail.trim() !== '' && isValidEmail(formData.contactEmail);
  const phoneValid = formData.contactPhone && formData.contactPhone.trim() !== '';
  
  const showEmailError = shouldValidate && !emailValid;
  const showPhoneError = shouldValidate && !phoneValid;

  const handlePhoneChange = (value: string | undefined) => {
    updateFormData({ contactPhone: value || '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
          Contact Information
        </h2>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Provide your primary contact details for LLC communications.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) =>
              updateFormData({ contactEmail: e.target.value })
            }
            placeholder="contact@example.com"
            className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
            required
            aria-required="true"
          />
          <p className="text-xs text-neutral-500 mt-1">
            This email will be used for official LLC communications
          </p>
          {showEmailError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">
                {formData.contactEmail.trim() === '' ? 'Contact email is required' : 'Please enter a valid email address'}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <div className={`
            phone-input-container
            ${showPhoneError ? 'border-red-500' : 'border-neutral-200 focus-within:border-neutral-900'}
            border-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all
          `}>
            <PhoneInput
              international
              defaultCountry="US"
              value={formData.contactPhone}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
              className="w-full"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Select your country and enter your phone number
          </p>
          {showPhoneError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">
                Contact phone is required
              </p>
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
    </div>
  );
}

