import { create } from 'zustand'

interface SuiValues {
  suiWallets?: any
  currentWallet?: any
  connectionStatus?: any
  connectWallet?: any
  disconnectWallet?: any
  isExternalContext?: boolean
}

interface SuiStore {
  suiValues: SuiValues
  setSuiValues: (values: SuiValues) => void
}

export const useSuiStore = create<SuiStore>((set) => ({
  suiValues: {},
  setSuiValues: (values: SuiValues) => set({ suiValues: values }),
}))

export const setSuiValues = (values: SuiValues): void => {
  useSuiStore.getState().setSuiValues(values)
}
