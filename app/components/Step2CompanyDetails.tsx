'use client';

import React from 'react';
import { useForm } from '../contexts/FormContext';

export function Step2CompanyDetails() {
  const { formData, updateFormData, shouldValidate } = useForm();
  const companyNameValid = formData.companyName.trim() !== '';
  const purposeValid = formData.purpose.trim() !== '';
  const showCompanyNameError = shouldValidate && !companyNameValid;
  const showPurposeError = shouldValidate && !purposeValid;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
          Company Information
        </h2>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Provide your desired company name and business purpose.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => {
              updateFormData({ companyName: e.target.value });
            }}
            placeholder="e.g., Acme Business Solutions LLC"
            className="w-full h-14 px-5 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
            required
            aria-required="true"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must include "LLC", "L.L.C.", or "Limited Liability Company"
          </p>
          {showCompanyNameError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">Company name is required</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">
            Business Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => {
              updateFormData({ purpose: e.target.value });
            }}
            placeholder="Describe the primary purpose of your business..."
            rows={4}
            className="w-full px-5 py-4 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all resize-none text-black placeholder:text-neutral-400 bg-white shadow-sm hover:shadow-md"
            required
            aria-required="true"
          />
          <p className="text-xs text-gray-500 mt-1">
            A general purpose statement is acceptable (e.g., "To engage in any lawful business")
          </p>
          {showPurposeError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-2 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800 font-medium">Business purpose is required</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

