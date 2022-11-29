import create from 'zustand';
import type { SendToWalletStore } from './types';

export const useSendToWalletStore = create<SendToWalletStore>((set) => ({
  showSendToWallet: false,
  toggleSendToWallet: () => {
    set((state) => ({
      showSendToWallet: !state.showSendToWallet,
    }));
  },
}));
