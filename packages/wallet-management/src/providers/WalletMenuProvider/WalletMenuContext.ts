import { createContext, useContext } from 'react'
import type {
  WalletMenuContext as _WalletMenuContext,
  WalletMenuOpenArgs,
} from './types.js'

export const WalletMenuContext = createContext<_WalletMenuContext>({
  isWalletMenuOpen: () => {},
  toggleWalletMenu: () => {},
  openWalletMenu: (_?: WalletMenuOpenArgs) => {},
  closeWalletMenu: () => {},
})

export const useWalletMenu = (): _WalletMenuContext =>
  useContext(WalletMenuContext)
