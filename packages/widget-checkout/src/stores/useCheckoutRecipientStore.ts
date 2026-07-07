'use client'
import type { ChainType } from '@lifi/sdk'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const RECIPIENT_STORAGE_KEY = 'lifi-checkout-recipient'
export const RECIPIENT_RECORD_VERSION = 1

export interface CheckoutRecipient {
  address: string
  chainType: ChainType
}

interface CheckoutRecipientState {
  recipients: Record<string, CheckoutRecipient>
  setRecipient: (integrator: string, recipient: CheckoutRecipient) => void
  clearRecipient: (integrator: string) => void
}

export const useCheckoutRecipientStore: UseBoundStore<
  StoreApi<CheckoutRecipientState>
> = create<CheckoutRecipientState>()(
  persist(
    (set) => ({
      recipients: {},
      setRecipient: (integrator, recipient) =>
        set((state) => ({
          recipients: { ...state.recipients, [integrator]: recipient },
        })),
      clearRecipient: (integrator) =>
        set((state) => {
          if (!(integrator in state.recipients)) {
            return state
          }
          const { [integrator]: _removed, ...rest } = state.recipients
          return { recipients: rest }
        }),
    }),
    {
      name: RECIPIENT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recipients: state.recipients }),
      version: RECIPIENT_RECORD_VERSION,
    }
  )
)
