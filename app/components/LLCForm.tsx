'use client';

import React from 'react';
import { useForm } from '../contexts/FormContext';
import { isValidEmail, isValidPhoneWithCountryCode } from '../utils/validation';
import { ProgressIndicator } from './ProgressIndicator';
import { Step1StateSelection } from './Step1StateSelection';
import { Step2CompanyDetails } from './Step2CompanyDetails';
import { Step3Addresses } from './Step3Addresses';
import { Step4Management } from './Step4Management';
import { Step5Contact } from './Step5Contact';
import { Step6Account } from './Step6Account';
import { Step7AdditionalServices } from './Step7AdditionalServices';
import { Step8Payment } from './Step8Payment';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STEP_LABELS = [
  'State',
  'Company',
  'Address',
  'Management',
  'Contact',
  'Account',
  'Services',
  'Payment',
];

export function LLCForm() {
  const { currentStep: rawCurrentStep, nextStep, previousStep, formData, triggerValidation } = useForm();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use initial step (0) during hydration to match SSR
  const currentStep = isMounted ? rawCurrentStep : 0;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1StateSelection />;
      case 1:
        return <Step2CompanyDetails />;
      case 2:
        return <Step3Addresses />;
      case 3:
        return <Step4Management />;
      case 4:
        return <Step5Contact />;
      case 5:
        return <Step6Account />;
      case 6:
        return <Step7AdditionalServices />;
      case 7:
        return <Step8Payment />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (!isMounted) return false;
    switch (currentStep) {
      case 0:
        return formData.state !== '' && formData.state.trim() !== '';
      case 1:
        return formData.companyName.trim() !== '' && formData.purpose.trim() !== '';
      case 2:
        // If Registered Agent service is enabled, it's automatically valid (service handles it)
        // Otherwise, check regular address fields
        const physicalValid = formData.physicalRegisteredAgent
          ? true // Registered Agent service handles the address
          : formData.physicalAddress.street !== '' &&
          formData.physicalAddress.city !== '' &&
          formData.physicalAddress.state !== '' &&
          formData.physicalAddress.zip !== '';

        const mailingValid = formData.mailingRegisteredAgent
          ? true // Registered Agent service handles the address
          : formData.sameAsPhysical
            ? true // If using physical address, it's already validated
            : formData.mailingAddress.street !== '' &&
            formData.mailingAddress.city !== '' &&
            formData.mailingAddress.state !== '' &&
            formData.mailingAddress.zip !== '';

        return physicalValid && mailingValid;
      case 3:
        // At least 1 owner is required, and all owner fields must be valid
        if (formData.owners.length === 0) return false;
        return formData.owners.every(owner => {
          const firstNameValid = owner.firstName.trim() !== '';
          const lastNameValid = owner.lastName.trim() !== '';
          const emailValid = owner.email.trim() !== '' && isValidEmail(owner.email);
          const phoneValid = owner.phone && owner.phone.trim() !== '';
          const addressValid = owner.address.trim() !== '';

          return firstNameValid && lastNameValid && emailValid && phoneValid && addressValid;
        });
      case 4:
        return (
          formData.contactEmail.trim() !== '' &&
          isValidEmail(formData.contactEmail) &&
          formData.contactPhone && formData.contactPhone.trim() !== ''
        );
      case 5:
        return (
          formData.accountEmail.trim() !== '' &&
          isValidEmail(formData.accountEmail) &&
          formData.password !== '' &&
          formData.confirmPassword !== '' &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 8
        );
      case 6:
        return true; // Services are optional
      case 7:
        return true; // Payment validation handled in Step8Payment
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-zinc-50 flex flex-col relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110">
          <svg className="w-6 h-6 text-neutral-600 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">Back to Home</span>
      </Link>

      {/* Main Content */}
      <main className="flex-1 pt-12 md:pt-20 pb-8 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto h-full flex flex-col space-y-6 md:space-y-10">
          {/* Progress Indicator */}
          <div className="bg-transparent md:bg-white md:rounded-3xl md:shadow-xl md:border md:border-neutral-200 p-0 md:p-8 flex-shrink-0">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={8}
              steps={STEP_LABELS}
            />
          </div>

          {/* Step Content */}
          <div className="bg-transparent md:bg-white md:rounded-3xl md:shadow-2xl md:border md:border-neutral-200 p-0 md:p-12 flex-1">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-transparent md:bg-white md:rounded-3xl md:shadow-xl md:border md:border-neutral-200 p-0 md:p-6 flex-shrink-0 pt-6 md:pt-6 border-t md:border-t-0 border-neutral-200">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 0}
                className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 flex-shrink-0 ${currentStep === 0
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 hover:shadow-lg'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </span>
              </button>

              <div className="text-sm font-bold text-neutral-600 flex-shrink-0">
                Step {currentStep + 1} of 8
              </div>

              <button
                type="button"
                onClick={() => {
                  if (canProceed() && currentStep !== 7) {
                    nextStep();
                  } else {
                    triggerValidation();
                  }
                }}
                disabled={!canProceed() || currentStep === 7}
                className={`px-6 py-4 rounded-xl font-black transition-all duration-300 flex-shrink-0 ${!canProceed() || currentStep === 7
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="hidden sm:inline">Next</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
