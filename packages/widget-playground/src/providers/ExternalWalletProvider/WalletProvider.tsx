import { getChainsFromConfig, type SDKBaseConfig } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { ReownWalletProvider } from './ReownWalletProvider.js'
import { WidgetWalletConfigUpdater } from './WidgetWalletConfigUpdater.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useConfig()

  const { data: chains, isLoading } = useQuery({
    queryKey: ['chains'] as const,
    queryFn: async () => {
      return await getChainsFromConfig({
        ...config?.sdkConfig,
        integrator: 'li.fi-playground',
      } as SDKBaseConfig)
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

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
