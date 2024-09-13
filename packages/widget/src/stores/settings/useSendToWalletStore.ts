import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { SendToWalletStore } from './types.js';

export const useSendToWalletStore = createWithEqualityFn<SendToWalletStore>(
  (set) => ({
    showSendToWallet: false,
    setSendToWallet: (value) =>
      set({
        showSendToWallet: value,
      }),
  }),
  Object.is,
);

export const useSendToWalletActions = () => {
  const actions = useSendToWalletStore(
    (store) => ({
      setSendToWallet: store.setSendToWallet,
    }),
    shallow,
  );

  return actions;
};
