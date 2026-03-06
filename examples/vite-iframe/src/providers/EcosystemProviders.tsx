import { WalletManagementProvider } from '@lifi/wallet-management'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'
import type { FC, PropsWithChildren } from 'react'
import { useChains } from '../hooks/useChains'

const EthereumProviderInner = EthereumProvider()
const SolanaProviderInner = SolanaProvider()
const BitcoinProviderInner = BitcoinProvider()
const SuiProviderInner = SuiProvider()

export const EcosystemProviders: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains()

  return (
    <EthereumProviderInner chains={chains ?? []}>
      <SolanaProviderInner chains={chains ?? []}>
        <BitcoinProviderInner chains={chains ?? []}>
          <SuiProviderInner chains={chains ?? []}>
            <WalletManagementProvider>{children}</WalletManagementProvider>
          </SuiProviderInner>
        </BitcoinProviderInner>
      </SolanaProviderInner>
    </EthereumProviderInner>
  )
}
