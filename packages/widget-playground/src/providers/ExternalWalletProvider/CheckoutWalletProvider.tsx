import { useWidgetChains, type WidgetConfig } from '@lifi/widget'
import type { FC, PropsWithChildren } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { ReownWalletProvider } from './ReownWalletProvider.js'

/**
 * Mounts the Reown wallet stack for the checkout demo, rendering nothing until
 * chains resolve — children call AppKit hooks that throw before `createAppKit`.
 */
export const CheckoutWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useConfig()
  const { chains, isLoading } = useWidgetChains(config as WidgetConfig)

  if (!chains?.length || isLoading) {
    return null
  }

  return <ReownWalletProvider chains={chains}>{children}</ReownWalletProvider>
}
