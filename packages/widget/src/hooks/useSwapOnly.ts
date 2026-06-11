import { useSplitMode } from '../stores/headerTabs/useSplitMode.js'

export const useSwapOnly = (): boolean => {
  const state = useSplitMode()
  return state === 'swap'
}
