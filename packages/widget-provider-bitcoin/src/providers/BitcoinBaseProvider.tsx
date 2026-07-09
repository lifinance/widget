import type { Config, CreateConnectorFn } from '@bigmi/client'
import { BigmiProvider, useReconnect } from '@bigmi/react'
import { type FC, type PropsWithChildren, useRef } from 'react'
import {
  createDefaultBigmiConfig,
  type DefaultBigmiConfigResult,
} from '../utils/createDefaultBigmiConfig.js'

interface BitcoinBaseProviderProps extends PropsWithChildren {
  connectors?: CreateConnectorFn[]
}

export const BitcoinBaseProvider: FC<BitcoinBaseProviderProps> = ({
  children,
  connectors,
}) => {
  const bigmi = useRef<DefaultBigmiConfigResult>(null)

  if (!bigmi.current) {
    bigmi.current = createDefaultBigmiConfig({
      bigmiConfig: {
        ssr: true,
        multiInjectedProviderDiscovery: false,
      },
      connectors,
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
