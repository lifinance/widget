import type { ContractCall, WidgetConfig } from '@lifi/widget'
import { ChainType, CoinKey, LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { TronProvider } from '@lifi/widget-provider-tron'
import { useMemo } from 'react'
import { DepositCard } from './components/DepositCard'
import { contractTool } from './config'

// Built once at module scope so the provider instances stay referentially stable.
const providers = [
  EthereumProvider({ walletConnect: true, coinbase: { appName: 'Deposit' } }),
  SolanaProvider(),
  TronProvider(),
]

// EXAMPLE CONTRACT, DON'T DEPOSIT
const depositAddress = '0x4bF3E32de155359D1D75e8B474b66848221142fc'

const contractCalls: ContractCall[] = []

export function App() {
  const widgetConfig: WidgetConfig = useMemo(() => {
    const baseConfig: WidgetConfig = {
      toAddress: {
        ...contractTool,
        address: depositAddress,
        chainType: ChainType.EVM,
      },
      mode: 'custom',
      modeOptions: { custom: { type: 'deposit' } },
      integrator: 'ProtocolName',
      providers,
      disabledUI: { toAddress: true },
      hiddenUI: { appearance: true, language: true },
      showSingleRoute: true,
      theme: {
        container: {
          border: '1px solid rgb(234, 234, 234)',
          borderRadius: '16px',
        },
      },
    }
    return baseConfig
  }, [])

  return (
    <LiFiWidget
      contractComponent={
        <DepositCard
          token={{
            chainId: 10,
            address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
            symbol: 'USDC',
            name: 'USD Coin',
            decimals: 6,
            priceUSD: '1',
            coinKey: CoinKey.USDC,
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
          }}
          contractCalls={contractCalls}
        />
      }
      contractTool={contractTool}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
    />
  )
}
