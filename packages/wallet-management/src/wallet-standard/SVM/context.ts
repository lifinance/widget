import { createContext } from 'react'

import type { WalletStore } from '../walletStore'

export const SVMWalletContext = createContext<WalletStore | null>(null)
