import { useAvailableChains } from '@lifi/widget'
import type { FC, PropsWithChildren } from 'react'
import { ReownWalletProvider } from './ReownWalletProvider.js'
import { WidgetWalletConfigUpdater } from './WidgetWalletConfigUpdater.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains, isLoading } = useAvailableChains()

  if (!chains?.length || isLoading) {
    return null
  }

  return (
    <ReownWalletProvider chains={chains}>
      <WidgetWalletConfigUpdater />
      {children}
    </ReownWalletProvider>
  )
}
