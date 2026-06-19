import { type Context, createContext, use } from 'react'
import type { WalletManagementConfig } from './types.js'

export const initialContext: WalletManagementConfig = {}

export const WalletManagementContext: Context<WalletManagementConfig> =
  createContext<WalletManagementConfig>(initialContext)

export const useWalletManagementConfig = (): WalletManagementConfig =>
  use(WalletManagementContext)
