import { type FC, type PropsWithChildren, useRef } from 'react'
import { createWalletStore } from '../walletStore'
import { SVMWalletContext } from './context'
import { useSVMWallets } from './hooks/useSVMWallets'

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallets = useSVMWallets()
  const storeRef = useRef(
    createWalletStore({
      wallets,
    })
  )
  return (
    <SVMWalletContext.Provider value={storeRef.current}>
      {children}
    </SVMWalletContext.Provider>
  )
}
