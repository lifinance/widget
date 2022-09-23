import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { SendToWalletStore } from './types';

export const useSendToWalletStore = create<SendToWalletStore>()(
  immer((set) => ({
    showSendToWallet: false,
    toggleSendToWallet: () => {
      set((state) => {
        state.showSendToWallet = !state.showSendToWallet;
      });
    },
  })),
);
