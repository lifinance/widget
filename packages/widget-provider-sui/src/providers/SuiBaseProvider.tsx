import { ChainId, type ExtendedChain } from '@lifi/sdk'
import { createDAppKit } from '@mysten/dapp-kit-core'
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { DAppKitProvider } from '../hooks.js'

interface SuiBaseProviderProps {
  chains?: ExtendedChain[]
}

export const SuiBaseProvider: FC<PropsWithChildren<SuiBaseProviderProps>> = ({
  chains,
  children,
}) => {
  const dappKit = useMemo(() => {
    const sui = chains?.find((chain) => chain.id === ChainId.SUI)
    return createDAppKit({
      networks: ['mainnet'],
      createClient: (network) =>
        new SuiJsonRpcClient({
          network,
          url: sui?.metamask?.rpcUrls[0] ?? getJsonRpcFullnodeUrl('mainnet'),
        }),
      autoConnect: true,
      storage: localStorage,
      storageKey: 'myapp_dappkit',
    })
  }, [chains])
  return <DAppKitProvider value={dappKit}>{children}</DAppKitProvider>
}
