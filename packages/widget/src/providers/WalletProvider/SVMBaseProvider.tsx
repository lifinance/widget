import {
  createSolanaRpcClient,
  type SolanaClientConfig,
} from '@solana/client-core'
import {
  SolanaClientProvider,
  useWalletStandardConnectors,
} from '@solana/react-hooks'
import { type FC, type PropsWithChildren, useMemo } from 'react'

const DEFAULT_CLIENT_CONFIG: SolanaClientConfig = {
  commitment: 'confirmed',
  endpoint: 'https://api.mainnet-beta.solana.com',
  websocketEndpoint: 'wss://api.mainnet-beta.solana.com',
}

const rpcClient = createSolanaRpcClient({
  ...DEFAULT_CLIENT_CONFIG,
})

export const SVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const walletConnectors = useWalletStandardConnectors()
  const config = useMemo(
    () => ({
      ...DEFAULT_CLIENT_CONFIG,
      rpcClient,
      walletConnectors,
    }),
    [walletConnectors]
  )
  return <SolanaClientProvider config={config}>{children}</SolanaClientProvider>
}
