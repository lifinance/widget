import { ChainId, type ExtendedChain } from '@lifi/sdk'
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { type FC, type PropsWithChildren, useRef } from 'react'
import type { SuiProviderConfig } from '../types.js'
import { SuiProviderValues } from './SuiProviderValues.js'

interface SuiBaseProviderProps {
  chains?: ExtendedChain[]
  isExternalContext?: boolean
  config?: SuiProviderConfig
}

export const SuiBaseProvider: FC<PropsWithChildren<SuiBaseProviderProps>> = ({
  chains,
  children,
  isExternalContext = false,
  config,
}) => {
  const storageKey = 'li.fi-sui-dapp-kit'
  const dappKit = useRef<DefaultExpectedDppKit>(null)

  if (!dappKit.current) {
    const sui = chains?.find((chain) => chain.id === ChainId.SUI)
    dappKit.current = createDAppKit({
      networks: ['mainnet'],
      createClient: (network) =>
        new SuiGrpcClient({
          network,
          baseUrl:
            sui?.metamask?.rpcUrls[0] ?? 'https://fullnode.mainnet.sui.io:443',
        }),
      autoConnect: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      storageKey,
    })
  }

  return (
    <DAppKitProvider dAppKit={dappKit.current}>
      <SuiProviderValues isExternalContext={isExternalContext} config={config}>
        {children}
      </SuiProviderValues>
    </DAppKitProvider>
  )
}
