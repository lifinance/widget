import { useSuiStore } from './stores/suiStoreZustand.js'

export const useWalletStore = (chainType: string) => {
  const suiSnapshot = useSuiStore((state) => state.suiValues)
  const store: Record<string, any> = { MVM: suiSnapshot }
  return chainType ? store[chainType as keyof typeof store] : store
}
