import { useAccount } from '@lifi/wallet-management'
import { LiFiWidgetLight } from '@lifi/widget-light'
import { useBitcoinIframeHandler } from '@lifi/widget-light/bitcoin'
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
import { useSolanaIframeHandler } from '@lifi/widget-light/solana'
import { useSuiIframeHandler } from '@lifi/widget-light/sui'
import {
  useSolanaWalletStandard,
  useWalletAccount,
} from '@lifi/widget-provider-solana'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { WalletHeader } from './components/WalletHeader'
import { widgetConfig } from './widgetConfig'

const WIDGET_URL = import.meta.env.VITE_WIDGET_URL || 'https://widget.li.fi'
const WIDGET_ORIGIN = new URL(WIDGET_URL).origin

export function HostApp() {
  const { account } = useAccount()

  const ethHandler = useEthereumIframeHandler()

  const { selectedWallet, connected } = useSolanaWalletStandard()
  const { address: solAddress } = useWalletAccount()
  const solHandler = useSolanaIframeHandler({
    address: solAddress,
    connected,
    wallet: selectedWallet,
  })

  const btcHandler = useBitcoinIframeHandler()
  const suiHandler = useSuiIframeHandler()
  const handlers = useMemo(
    () => [ethHandler, solHandler, btcHandler, suiHandler],
    [ethHandler, solHandler, btcHandler, suiHandler]
  )

  return (
    <Box height="100vh" display="flex" flexDirection="column" bgcolor="#F5F5F5">
      <WalletHeader />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex={1}
        minHeight={0}
        pt={6}
        gap={2}
      >
        {!account.isConnected && (
          <Typography color="text.secondary" fontSize={14} mb={1}>
            Connect your wallet above — all widget transactions will be signed
            through your connected wallet.
          </Typography>
        )}

        <LiFiWidgetLight
          src={WIDGET_URL}
          config={widgetConfig}
          handlers={handlers}
          iframeOrigin={WIDGET_ORIGIN}
          autoResize={false}
          style={{ border: 0, width: '100%', flex: 1, minHeight: 0 }}
          title="LI.FI Widget"
        />
      </Box>
    </Box>
  )
}
