import { create } from 'zustand';
import type { SendToWalletStore } from './types';

export const useSendToWalletStore = create<SendToWalletStore>((set) => ({
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
}));
