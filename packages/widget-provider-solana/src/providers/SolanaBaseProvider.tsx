import type { FC, PropsWithChildren } from 'react'
import { SolanaWalletStandardProvider as WalletProvider } from './SolanaWalletStandardProvider'

export const SolanaBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WalletProvider config={{ autoConnect: true }}>{children}</WalletProvider>
  )
}
