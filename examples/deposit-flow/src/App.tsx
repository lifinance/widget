import type { ContractCall, WidgetConfig } from '@lifi/widget'
import {
  ChainType,
  CoinKey,
  DisabledUI,
  HiddenUI,
  ItemPrice,
  LiFiWidget,
} from '@lifi/widget'
import { useMemo } from 'react'

const depositAddress = '0xdde759c7cf032b1d0e633a7e9cfa6653d1911a22'
const depositAmount = 5000000n

export const contractTool = {
  logoURI:
    'https://github.com/lifinance/widget/assets/18644653/eb043a91-18ba-4da7-91c4-029a53a25989',
  name: 'Immutable',
}

const contractCalls: ContractCall[] = []

export function App() {
  const widgetConfig: WidgetConfig = useMemo(() => {
    const baseConfig: WidgetConfig = {
      toAddress: {
        ...contractTool,
        address: depositAddress,
        chainType: ChainType.EVM,
      },
      subvariant: 'custom',
      subvariantOptions: { custom: 'deposit' },
      integrator: 'Immutable',
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language],
      useRecommendedRoute: true,
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
        <ItemPrice
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
            amount: depositAmount,
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
