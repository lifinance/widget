import type { DefaultExpectedDppKit } from '@mysten/dapp-kit-core'
import { useStore } from '@nanostores/react'
import { createContext, useContext } from 'react'

const DAppKitContext = createContext<DefaultExpectedDppKit | null>(null)

export const DAppKitProvider = DAppKitContext.Provider

export function useDAppKit(
  dAppKit?: DefaultExpectedDppKit
): DefaultExpectedDppKit {
  const contextValue = useContext(DAppKitContext)
  if (dAppKit) {
    return dAppKit
  }
  if (!contextValue) {
    throw new Error(
      'Could not find DAppKitContext. Ensure that you have set up the DAppKitProvider component.'
    )
  }
  return contextValue
}

export function useWallets() {
  return useStore(useDAppKit().stores.$wallets)
}

export function useWalletConnection() {
  return useStore(useDAppKit().stores.$connection)
}

export function useCurrentWallet() {
  return useWalletConnection().wallet
}
