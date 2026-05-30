import { create } from "zustand";

export type PropertyType = "plot" | "flat" | "villa";
export type PurposeType = "investment" | "family-living" | "rental-income";
export type LifestyleType = "luxury" | "affordable" | "family-friendly" | "high-growth" | "premium";

export interface WizardState {
  step: number;
  budgetMin: number;
  budgetMax: number;
  budgetLabel: string;
  propertyType: PropertyType | "";
  purpose: PurposeType | "";
  lifestyle: LifestyleType | "";
  preferredLocation: string;
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setBudget: (min: number, max: number, label: string) => void;
  setPropertyType: (type: PropertyType) => void;
  setPurpose: (purpose: PurposeType) => void;
  setLifestyle: (lifestyle: LifestyleType) => void;
  setPreferredLocation: (location: string) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  budgetMin: 0,
  budgetMax: 0,
  budgetLabel: "",
  propertyType: "",
  purpose: "",
  lifestyle: "",
  preferredLocation: "",
  
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 6) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setStep: (step) => set({ step }),
  setBudget: (min, max, label) => set({ budgetMin: min, budgetMax: max, budgetLabel: label }),
  setPropertyType: (propertyType) => set({ propertyType }),
  setPurpose: (purpose) => set({ purpose }),
  setLifestyle: (lifestyle) => set({ lifestyle }),
  setPreferredLocation: (preferredLocation) => set({ preferredLocation }),
  reset: () => set({
    step: 1,
    budgetMin: 0,
    budgetMax: 0,
    budgetLabel: "",
    propertyType: "",
    purpose: "",
    lifestyle: "",
    preferredLocation: ""
  })
}));
