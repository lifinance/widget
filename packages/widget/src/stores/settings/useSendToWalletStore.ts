import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { SendToWalletStore } from './types.js';

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
    initialiseSendToWallet: (value) =>
      set({
        showSendToWallet: value,
      }),
  }),
  Object.is,
);

export const useSendToWalletActions = () => {
  const actions = useSendToWalletStore(
    (store) => ({
      toggleSendToWallet: store.toggleSendToWallet,
      setSendToWallet: store.setSendToWallet,
      initialiseSendToWallet: store.initialiseSendToWallet,
    }),
    shallow,
  );

  return actions;
};
