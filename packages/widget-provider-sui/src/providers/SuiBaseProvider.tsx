import { ChainId, type ExtendedChain } from '@lifi/sdk'
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc'
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'

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
  const [ready, setReady] = useState(false)

  // createDAppKit registers wallets in the global wallet-standard registry,
  // which triggers state updates in sibling providers (e.g. SolanaProviderValues).
  // Deferring creation to an effect avoids the "Cannot update a component while
  // rendering a different component" React error.
  useEffect(() => {
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
      setReady(true)
    }
  }, [chains, storageKey])

  if (!ready || !dappKit.current) {
    return null
  }

  return <DAppKitProvider dAppKit={dappKit.current}>{children}</DAppKitProvider>
}
