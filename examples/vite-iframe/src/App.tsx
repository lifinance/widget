import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import type { ConnectWalletArgs } from '@lifi/widget-light'
import { LiFiWidgetLight } from '@lifi/widget-light'
import { useBitcoinIframeHandler } from '@lifi/widget-light/bitcoin'
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
import { useSolanaIframeHandler } from '@lifi/widget-light/solana'
import { useSuiIframeHandler } from '@lifi/widget-light/sui'
import {
  useSolanaWalletStandard,
  useWalletAccount,
} from '@lifi/widget-provider-solana'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { WalletHeader } from './components/WalletHeader'
import { WidgetEventsLogger } from './components/WidgetEventsLogger'
import { widgetConfig as baseWidgetConfig } from './widgetConfig'

// When VITE_WIDGET_URL is set (e.g. via --mode localhost), override the default.
const WIDGET_URL = import.meta.env.VITE_WIDGET_URL || undefined

export function HostApp() {
  const { account } = useAccount()
  const { openWalletMenu } = useWalletMenu()

  // -- Config reactivity demo: toggle variant between 'wide' and 'compact' --
  const [variant, setVariant] = useState<'wide' | 'compact'>('wide')
  const toggleVariant = useCallback(
    () => setVariant((v) => (v === 'wide' ? 'compact' : 'wide')),
    []
  )

  // -- External wallet connect: open host wallet modal on iframe request --
  const handleConnect = useCallback(
    (args?: ConnectWalletArgs) => {
      console.log('[HostApp] onConnect request from widget', args)
      openWalletMenu()
    },
    [openWalletMenu]
  )

  const widgetConfig = useMemo(
    () => ({
      ...baseWidgetConfig,
      variant,
    }),
    [variant]
  )

  // -- Ecosystem handlers --
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

        <Box display="flex" gap={1}>
          <Button variant="outlined" size="small" onClick={toggleVariant}>
            Toggle variant (current: {variant})
          </Button>
        </Box>

        <LiFiWidgetLight
          src={WIDGET_URL}
          config={widgetConfig}
          handlers={handlers}
          autoResize={false}
          onConnect={handleConnect}
          style={{ border: 0, width: '100%', flex: 1, minHeight: 0 }}
          title="LI.FI Widget"
        />
      </Box>

      <WidgetEventsLogger />
    </Box>
  )
}
