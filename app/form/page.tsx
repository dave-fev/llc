'use client';

import React from 'react';
import { FormProvider } from '../contexts/FormContext';
import { LLCForm } from '../components/LLCForm';
import { useMaintenanceCheck } from '../hooks/useMaintenanceCheck';

export default function FormPage() {
  useMaintenanceCheck();

  return (
    <FormProvider>
      <LLCForm />
    </FormProvider>
  );
}

