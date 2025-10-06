import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { SendToWalletStore } from './types.js'

export const sendToWalletStore = create<SendToWalletStore>((set) => ({
  showSendToWallet: false,
  setSendToWallet: (value) =>
    set({
      showSendToWallet: value,
    }),
}))

export const useSendToWalletStore = <T>(
  selector: (state: SendToWalletStore) => T
): T => {
  return sendToWalletStore(useShallow(selector))
}

export const useSendToWalletActions = () => {
  const actions = useSendToWalletStore((store) => ({
    setSendToWallet: store.setSendToWallet,
  }))

  return actions
}
