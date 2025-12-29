import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  // Step 1: State Selection
  state: string;
  stateFee: number;

  // Step 2: Company Details
  companyName: string;
  purpose: string;

  // Step 3: Addresses
  physicalAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  physicalRegisteredAgent: boolean;
  physicalAgentAddress: string;
  mailingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mailingRegisteredAgent: boolean;
  mailingAgentAddress: string;
  sameAsPhysical: boolean;

  // Step 4: Management
  managementType: 'member-managed' | 'manager-managed';
  owners: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  }>;
  managers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  }>;

  // Step 5: Contact
  contactEmail: string;
  contactPhone: string;

  // Step 6: Account
  accountEmail: string;
  password: string;
  confirmPassword: string;

  // Step 7: Additional Services
  additionalServices: {
    ein: boolean;
    website: boolean;
    itin: boolean;
    branding: boolean;
  };

  // Step 8: Payment
  paymentMethod: 'card' | 'ach';
}

interface FormState {
  formData: FormData;
  currentStep: number;
  shouldValidate: boolean;
}

const initialState: FormState = {
  formData: {
    state: '',
    stateFee: 0,
    companyName: '',
    purpose: '',
    physicalAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    physicalRegisteredAgent: false,
    physicalAgentAddress: '',
    mailingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    mailingRegisteredAgent: false,
    mailingAgentAddress: '',
    sameAsPhysical: false,
    managementType: 'member-managed',
    owners: [{ firstName: '', lastName: '', email: '', phone: '', address: '' }],
    managers: [],
    contactEmail: '',
    contactPhone: '',
    accountEmail: '',
    password: '',
    confirmPassword: '',
    additionalServices: {
      ein: false,
      website: false,
      itin: false,
      branding: false,
    },
    paymentMethod: 'card',
  },
  currentStep: 0,
  shouldValidate: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.shouldValidate = false;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      const totalSteps = 8;
      if (action.payload >= 0 && action.payload < totalSteps) {
        state.currentStep = action.payload;
        state.shouldValidate = false;
      }
    },
    nextStep: (state) => {
      const totalSteps = 8;
      if (state.currentStep < totalSteps - 1) {
        state.currentStep += 1;
        state.shouldValidate = false;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        state.shouldValidate = false;
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      const totalSteps = 8;
      if (action.payload >= 0 && action.payload < totalSteps) {
        state.currentStep = action.payload;
        state.shouldValidate = false;
      }
    },
    triggerValidation: (state) => {
      state.shouldValidate = true;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 0;
      state.shouldValidate = false;
    },
  },
});

export const {
  updateFormData,
  setCurrentStep,
  nextStep,
  previousStep,
  goToStep,
  triggerValidation,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;



