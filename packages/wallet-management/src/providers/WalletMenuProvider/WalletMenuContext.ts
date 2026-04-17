import type { Context } from 'react'
import { createContext, useContext } from 'react'
import type {
  WalletMenuContext as _WalletMenuContext,
  WalletMenuOpenArgs,
} from './types.js'

export const WalletMenuContext: Context<_WalletMenuContext> =
  createContext<_WalletMenuContext>({
    isWalletMenuOpen: () => false,
    toggleWalletMenu: () => {},
    openWalletMenu: (_?: WalletMenuOpenArgs) => {},
    closeWalletMenu: () => {},
  })

export const useWalletMenu = (): _WalletMenuContext =>
  useContext(WalletMenuContext)
