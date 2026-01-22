import { useSolanaWalletStandard } from '@lifi/widget-provider-solana'
import { useAppKitProvider, useAppKitState } from '@reown/appkit/react'
import type { Provider as SolanaWalletProvider } from '@reown/appkit-adapter-solana'
import { type FC, type PropsWithChildren, useEffect } from 'react'

export const SolanaProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletProvider: solanaProvider } =
    useAppKitProvider<SolanaWalletProvider>('solana')
  const { initialized } = useAppKitState()

  const { select, disconnect } = useSolanaWalletStandard()

  useEffect(() => {
    if (initialized) {
      if (solanaProvider?.name) {
        select(solanaProvider.name, { silent: true })
      } else {
        disconnect()
      }
    }

    return () => {
      if (initialized) {
        disconnect()
      }
    }
  }, [solanaProvider?.name, select, disconnect, initialized])

  return children
}
