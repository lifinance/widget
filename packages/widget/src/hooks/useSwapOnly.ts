import { useSplitSubvariantStore } from '../stores/settings/useSplitSubvariantStore.js'

export const useSwapOnly = (): boolean => {
  const state = useSplitSubvariantStore((state) => state.state)
  return state === 'swap'
}
