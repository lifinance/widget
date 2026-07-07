import { ChainType } from '@lifi/widget'
import { LifiWidgetCheckout } from '@lifi/widget-checkout'
import { meshProvider } from '@lifi/widget-provider-mesh'
import { transakProvider } from '@lifi/widget-provider-transak'
import { Box, Button, Typography } from '@mui/material'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react'
import { widgetBaseConfig } from '../../defaultWidgetConfig.js'
import { useEnvVariables } from '../../providers/EnvVariablesProvider.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'

const DEFAULT_CHECKOUT_INTEGRATOR = 'widget-transak-test'
const DEFAULT_CHECKOUT_TO_CHAIN = 1
// USDC on Ethereum mainnet — demo destination asset when none is configured.
const DEFAULT_CHECKOUT_TO_TOKEN = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

export function CheckoutWidgetView(): JSX.Element {
  const { config } = useConfig()
  const {
    checkoutIntegrator,
    checkoutToChain,
    checkoutToToken,
    checkoutToAddress,
  } = useEnvVariables()
  const [open, setOpen] = useState(false)
  const { open: openWallet } = useAppKit()
  const { address: connectedAddress } = useAppKitAccount()

  // Keep the first connected address — disconnecting a funding wallet must not wipe the recipient.
  const [demoRecipient, setDemoRecipient] = useState<string>()
  useEffect(() => {
    if (connectedAddress) {
      setDemoRecipient(connectedAddress)
    }
  }, [connectedAddress])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleConnect = useCallback(() => {
    openWallet()
  }, [openWallet])

  // TODO(cleanup-remove-integrator-override-heuristic): Remove this heuristic comparison against
  // widgetBaseConfig.integrator and use a strict precedence contract.
  const resolvedIntegrator =
    config?.integrator && config.integrator !== widgetBaseConfig.integrator
      ? config.integrator
      : checkoutIntegrator?.trim() || DEFAULT_CHECKOUT_INTEGRATOR

  const resolvedToChain =
    config?.toChain ?? checkoutToChain ?? DEFAULT_CHECKOUT_TO_CHAIN
  const resolvedToToken =
    config?.toToken ?? checkoutToToken ?? DEFAULT_CHECKOUT_TO_TOKEN
  const resolvedToAddress = checkoutToAddress ?? demoRecipient

  const checkoutConfig = useMemo(
    () => ({
      ...config,
      providers: config?.providers ?? widgetBaseConfig.providers,
      toChain: resolvedToChain,
      toToken: resolvedToToken,
      ...(resolvedToAddress
        ? {
            toAddress: {
              address: resolvedToAddress,
              chainType: ChainType.EVM,
            },
          }
        : null),
      walletConfig: { onConnect: () => openWallet() },
    }),
    [config, resolvedToChain, resolvedToToken, resolvedToAddress, openWallet]
  )

  const onRampProviders = useMemo(() => [transakProvider(), meshProvider()], [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        flex: 1,
        minHeight: 320,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Checkout — opens as a centered widget
      </Typography>
      {resolvedToAddress ? (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', wordBreak: 'break-all' }}
          >
            Recipient: {resolvedToAddress}
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Deposit
          </Button>
        </>
      ) : (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Connect a wallet to set the checkout recipient.
          </Typography>
          <Button variant="contained" onClick={handleConnect}>
            Connect wallet
          </Button>
        </>
      )}
      <LifiWidgetCheckout
        open={open}
        integrator={resolvedIntegrator}
        config={checkoutConfig}
        onRampProviders={onRampProviders}
        onClose={handleClose}
      />
    </Box>
  )
}
