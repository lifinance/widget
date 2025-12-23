import { createClient, getChains } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { ReownWalletProvider } from './ReownWalletProvider.js'
import { WidgetWalletConfigUpdater } from './WidgetWalletConfigUpdater.js'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useConfig()

  const sdkClient = useMemo(() => {
    if (!config?.sdkConfig || !config.integrator) {
      return null
    }
    return createClient({
      ...config.sdkConfig,
      integrator: config.integrator,
      apiKey: config.apiKey,
    })
  }, [config?.sdkConfig, config?.integrator, config?.apiKey])

  const { data: chains, isLoading } = useQuery({
    queryKey: ['chains', config?.integrator] as const,
    queryFn: async () => {
      if (!sdkClient) {
        return []
      }
      return await getChains(sdkClient)
    },
    enabled: !!sdkClient,
    refetchInterval: 300_000,
    staleTime: 300_000,
    retry: false,
  })

  if (!chains?.length || isLoading) {
    return children
  }

  return (
    <ReownWalletProvider chains={chains}>
      <WidgetWalletConfigUpdater />
      {children}
    </ReownWalletProvider>
  )
}
