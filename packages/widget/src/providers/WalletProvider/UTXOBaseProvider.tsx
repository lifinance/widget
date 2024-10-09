import type { DefaultWagmiConfigResult } from '@lifi/wallet-management'
import {
  BigmiProvider,
  createDefaultBigmiConfig,
  useReconnect,
} from '@lifi/wallet-management'
import { type FC, type PropsWithChildren, useRef } from 'react'

export const UTXOBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const bigmi = useRef<DefaultWagmiConfigResult>()

  if (!bigmi.current) {
    bigmi.current = createDefaultBigmiConfig({
      bigmiConfig: {
        ssr: true,
        multiInjectedProviderDiscovery: false,
      },
    })
  }

  useReconnect(bigmi.current.config)

  return (
    <BigmiProvider config={bigmi.current.config} reconnectOnMount={false}>
      {children}
    </BigmiProvider>
  )
}
