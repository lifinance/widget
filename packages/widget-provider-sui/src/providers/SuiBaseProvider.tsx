import { ChainId, type ExtendedChain } from '@lifi/sdk'
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { SuiProviderValues } from './SuiProviderValues.js'

interface SuiBaseProviderProps {
  chains?: ExtendedChain[]
  namePrefix?: string
}

export const SuiBaseProvider: FC<PropsWithChildren<SuiBaseProviderProps>> = ({
  chains,
  children,
  namePrefix,
}) => {
  const storageKey = `${namePrefix || 'li.fi'}-sui-dapp-kit`
  const dappKit = useRef<DefaultExpectedDppKit>(null)

  if (!dappKit.current) {
    const sui = chains?.find((chain) => chain.id === ChainId.SUI)
    dappKit.current = createDAppKit({
      networks: ['mainnet'],
      createClient: (network) =>
        new SuiGrpcClient({
          network,
          baseUrl:
            sui?.metamask?.rpcUrls[0] ?? getJsonRpcFullnodeUrl('mainnet'),
        }),
      autoConnect: true,
      storage: localStorage,
      storageKey,
    })
  }

  return (
    <DAppKitProvider dAppKit={dappKit.current}>
      <SuiProviderValues isExternalContext={false}>
        {children}
      </SuiProviderValues>
    </DAppKitProvider>
  )
}
