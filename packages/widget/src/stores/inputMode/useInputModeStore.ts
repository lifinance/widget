import { create } from 'zustand'
import type { FormTypeProps } from '../form/types.js'

export type InputMode = 'amount' | 'price'

interface InputModeState {
  inputMode: Record<'from' | 'to', InputMode>
  setInputMode: (formType: FormTypeProps['formType'], mode: InputMode) => void
  toggleInputMode: (formType: FormTypeProps['formType']) => void
}

export const useInputModeStore = create<InputModeState>((set, get) => ({
  inputMode: {
    from: 'amount',
    to: 'amount',
  },
  setInputMode: (formType, mode) =>
    set((state) => ({
      inputMode: {
        ...state.inputMode,
        [formType]: mode,
      },
    })),
  toggleInputMode: (formType) => {
    const currentMode = get().inputMode[formType]
    const newMode = currentMode === 'amount' ? 'price' : 'amount'
    get().setInputMode(formType, newMode)
  },
}))
