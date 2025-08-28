import { createWithEqualityFn } from 'zustand/traditional'

interface TokensLoadingState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useTokensLoadingStore = createWithEqualityFn<TokensLoadingState>(
  (set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
  }),
  Object.is
)

export const useTokensLoading = () => {
  return useTokensLoadingStore((state) => state.isLoading)
}
