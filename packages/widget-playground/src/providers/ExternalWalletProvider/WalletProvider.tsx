import { createClient, getChains } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { ReownWalletProvider } from './ReownWalletProvider.js'
import { WidgetWalletConfigUpdater } from './WidgetWalletConfigUpdater.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useConfig()
  const sdkClient = useMemo(
    () =>
      createClient({
        integrator: 'li.fi-playground',
        ...config?.sdkConfig,
      }),
    [config?.sdkConfig]
  )
  const { data: chains, isLoading } = useQuery({
    queryKey: ['chains'] as const,
    queryFn: async () => {
      return await getChains(sdkClient)
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
