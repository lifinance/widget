import { LiFiWidgetLight } from '@lifi/widget-light'
import { Box, Typography } from '@mui/material'
import { useConnection } from 'wagmi'
import { WalletHeader } from './components/WalletHeader'
import { widgetConfig } from './widgetConfig'

const WIDGET_ORIGIN = 'http://localhost:3000'
const WIDGET_URL = WIDGET_ORIGIN

export function HostApp() {
  // wagmi v3: useAccount → useConnection
  const { isConnected } = useConnection()

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
        {!isConnected && (
          <Typography color="text.secondary" fontSize={14} mb={1}>
            Connect your wallet above — all widget transactions will be signed
            through your connected wallet.
          </Typography>
        )}

        <LiFiWidgetLight
          src={WIDGET_URL}
          config={widgetConfig}
          iframeOrigin={WIDGET_ORIGIN}
          style={{ width: 392, height: 640, borderRadius: 16 }}
          title="LI.FI Widget"
        />
      </Box>
    </Box>
  )
}
