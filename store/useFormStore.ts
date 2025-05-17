// store/useMultiStepStore.ts
import { create } from 'zustand';

interface MultiStepState {
  stepsData: Record<string, any>;
  setStepData: (step: string, data: Record<string, any>) => void;
  clearAll: () => void;
}

export const useMultiStepStore = create<MultiStepState>((set) => ({
  stepsData: {},
  setStepData: (step, data) =>
    set((state) => ({
      stepsData: {
        ...state.stepsData,
        [step]: data,
      },
    })),
  clearAll: () =>
    set(() => ({
      stepsData: {},
    })),
}));
