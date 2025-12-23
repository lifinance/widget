import {
  SolanaWalletStandardProvider,
  useSolanaWalletStandard,
} from '@lifi/widget-provider-solana'
import { useAppKitProvider } from '@reown/appkit/react'
import type { Provider as SolanaWalletProvider } from '@reown/appkit-adapter-solana'
import { type FC, type PropsWithChildren, useEffect } from 'react'

export const SolanaProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SolanaWalletStandardProvider>
      <SolanaReownHandler />
      {children}
    </SolanaWalletStandardProvider>
  )
}

const SolanaReownHandler: FC = () => {
  const { walletProvider: solanaProvider } =
    useAppKitProvider<SolanaWalletProvider>('solana')
  const { disconnect, select } = useSolanaWalletStandard()

  useEffect(() => {
    if (solanaProvider?.name) {
      select(solanaProvider.name)
    }
    return () => {
      disconnect()
    }
  }, [solanaProvider?.name, select, disconnect])

  return null
}
