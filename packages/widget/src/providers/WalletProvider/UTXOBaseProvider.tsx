import type { Config } from '@bigmi/client'
import { BigmiProvider, useReconnect } from '@bigmi/react'
import type { DefaultBigmiConfigResult } from '@lifi/wallet-management'
import { createDefaultBigmiConfig } from '@lifi/wallet-management'
import { type FC, type PropsWithChildren, useRef } from 'react'

export const UTXOBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const bigmi = useRef<DefaultBigmiConfigResult>(null)

  if (!bigmi.current) {
    bigmi.current = createDefaultBigmiConfig({
      bigmiConfig: {
        ssr: true,
        multiInjectedProviderDiscovery: false,
      },
    })
  }

  useReconnect(bigmi.current.config as Config)

  return (
    <BigmiProvider
      config={bigmi.current.config as Config}
      reconnectOnMount={false}
    >
      {children}
    </BigmiProvider>
  )
}
