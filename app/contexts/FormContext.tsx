"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateFormData,
  setCurrentStep,
  nextStep,
  previousStep,
  goToStep,
  triggerValidation,
  FormData,
} from "../store/formSlice";

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  triggerValidation: () => void;
  shouldValidate: boolean;
}

// Re-export FormData type for backward compatibility
export type { FormData };

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.form);
  const totalSteps = 8;

  const contextValue: FormContextType = {
    formData: formState.formData,
    updateFormData: (data: Partial<FormData>) => {
      dispatch(updateFormData(data));
    },
    currentStep: formState.currentStep,
    setCurrentStep: (step: number) => {
      dispatch(setCurrentStep(step));
    },
    totalSteps,
    nextStep: () => {
      dispatch(nextStep());
    },
    previousStep: () => {
      dispatch(previousStep());
    },
    goToStep: (step: number) => {
      dispatch(goToStep(step));
    },
    triggerValidation: () => {
      dispatch(triggerValidation());
    },
    shouldValidate: formState.shouldValidate,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
