import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { SendToWalletStore } from './types.js'

export const sendToWalletStore: UseBoundStore<StoreApi<SendToWalletStore>> =
  create<SendToWalletStore>((set) => ({
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

export const useSendToWalletActions = (): {
  setSendToWallet: (value: boolean) => void
} => {
  const actions = useSendToWalletStore((store) => ({
    setSendToWallet: store.setSendToWallet,
  }))

  return actions
}
