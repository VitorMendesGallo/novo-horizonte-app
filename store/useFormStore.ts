// store/useFormStore.ts
import { create } from 'zustand';

// 1. Defina a interface do estado
interface FormState {
  aluno: Record<string, any>;
  materno: Record<string, any>;
  paterno: Record<string, any>;
  obs: Record<string, any>;
  info: Record<string, any>;
  updateData: <K extends keyof Omit<FormState, 'updateData' | 'clearData'>>(
    section: K,
    data: Partial<FormState[K]>
  ) => void;
  clearData: () => void;
}

// 2. Crie o store com tipagem
export const useFormStore = create<FormState>((set) => ({
  aluno: {},
  materno: {},
  paterno: {},
  obs: {},
  info: {},

  updateData: (section, data) =>
    set((state) => ({
      [section]: { ...state[section], ...data }
    })),

  clearData: () =>
    set({
      aluno: {},
      materno: {},
      paterno: {},
      obs: {},
      info: {}
    })
}));
