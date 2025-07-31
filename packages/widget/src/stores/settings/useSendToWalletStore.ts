import { useShallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import type { SendToWalletStore } from './types.js'

export const createSendToWalletStore = createWithEqualityFn<SendToWalletStore>(
  (set) => ({
    showSendToWallet: false,
    setSendToWallet: (value) =>
      set({
        showSendToWallet: value,
      }),
  }),
  Object.is
)

export const useSendToWalletStore = <T>(
  selector: (state: SendToWalletStore) => T
): T => {
  return createSendToWalletStore(useShallow(selector))
}

export const useSendToWalletActions = () => {
  const actions = useSendToWalletStore((store) => ({
    setSendToWallet: store.setSendToWallet,
  }))

  return actions
}
