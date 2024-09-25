import { createContext, useContext } from 'react';
import type { WalletMenuContext as _WalletMenuContext } from './types.js';

export const WalletMenuContext = createContext<_WalletMenuContext>({
  isWalletMenuOpen: () => {},
  toggleWalletMenu: () => {},
  openWalletMenu: () => {},
  closeWalletMenu: () => {},
});

export const useWalletMenu = (): _WalletMenuContext =>
  useContext(WalletMenuContext);
