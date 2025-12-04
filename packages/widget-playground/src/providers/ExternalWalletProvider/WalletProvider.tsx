import { useWidgetChains, type WidgetConfig } from '@lifi/widget'
import type { FC, PropsWithChildren } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { ReownWalletProvider } from './ReownWalletProvider.js'
import { WidgetWalletConfigUpdater } from './WidgetWalletConfigUpdater.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useConfig()

  const { chains, isLoading } = useWidgetChains(config as WidgetConfig)

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
