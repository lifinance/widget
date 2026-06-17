import { useSplitModeStore } from '../stores/settings/useSplitModeStore.js'

export const useSwapOnly = (): boolean => {
  const state = useSplitModeStore((state) => state.state)
  return state === 'swap'
}
