import { useAccount } from '@lifi/wallet-management'
import { LiFiWidgetLight } from '@lifi/widget-light'
import { useBitcoinIframeHandler } from '@lifi/widget-provider-bitcoin'
import { useEthereumIframeHandler } from '@lifi/widget-provider-ethereum'
import { useSolanaIframeHandler } from '@lifi/widget-provider-solana'
import { useSuiIframeHandler } from '@lifi/widget-provider-sui'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { WalletHeader } from './components/WalletHeader'
import { widgetConfig } from './widgetConfig'

const WIDGET_ORIGIN = 'http://localhost:3000'
const WIDGET_URL = WIDGET_ORIGIN

export function HostApp() {
  const { account } = useAccount()

  const ethHandler = useEthereumIframeHandler()
  const solHandler = useSolanaIframeHandler()
  const btcHandler = useBitcoinIframeHandler()
  const suiHandler = useSuiIframeHandler()
  const handlers = useMemo(
    () => [ethHandler, solHandler, btcHandler, suiHandler],
    [ethHandler, solHandler, btcHandler, suiHandler]
  )

  return (
    <Box minHeight="100vh" bgcolor="#F5F5F5">
      <WalletHeader />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
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
          style={{ width: 392, height: 640, borderRadius: 16 }}
          title="LI.FI Widget"
        />
      </Box>
    </Box>
  )
}
