import { createWithEqualityFn } from 'zustand/traditional';
import type { SendToWalletStore } from './types';

export const useSendToWalletStore = createWithEqualityFn<SendToWalletStore>(
  (set) => ({
    showSendToWallet: false,
    showSendToWalletDirty: false,
    toggleSendToWallet: () =>
      set((state) => ({
        showSendToWallet: !state.showSendToWallet,
        showSendToWalletDirty: true,
      })),
    setSendToWallet: (value) =>
      set({
        showSendToWallet: value,
        showSendToWalletDirty: true,
      }),
  }),
  Object.is,
);
