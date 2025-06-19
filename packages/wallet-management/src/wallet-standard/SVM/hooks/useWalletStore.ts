import { useContext } from 'react'
import { useStore } from 'zustand'
import type { WalletStoreState } from '../../types'
import { SVMWalletContext } from '../context'

export function useWalletStore<T>(selector: (state: WalletStoreState) => T): T {
  const store = useContext(SVMWalletContext)
  if (!store) {
    throw new Error(
      'Could not find WalletContext. Ensure that you have set up the WalletProvider.'
    )
  }
  return useStore(store, selector)
}
