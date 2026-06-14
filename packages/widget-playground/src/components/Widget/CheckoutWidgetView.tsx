import { ChainType } from '@lifi/widget'
import { LifiWidgetCheckout } from '@lifi/widget-checkout'
import { meshProvider } from '@lifi/widget-provider-mesh'
import { transakProvider } from '@lifi/widget-provider-transak'
import { Box, Button, Typography } from '@mui/material'
import { type JSX, useCallback, useMemo, useState } from 'react'
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

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  // TODO(cleanup-remove-integrator-override-heuristic): Remove this heuristic comparison against
  // widgetBaseConfig.integrator and use a strict precedence contract.
  const resolvedIntegrator =
    config?.integrator && config.integrator !== widgetBaseConfig.integrator
      ? config.integrator
      : checkoutIntegrator?.trim() || DEFAULT_CHECKOUT_INTEGRATOR

  const configToAddress =
    typeof config?.toAddress === 'string'
      ? config.toAddress
      : config?.toAddress?.address
  const resolvedToChain =
    config?.toChain ?? checkoutToChain ?? DEFAULT_CHECKOUT_TO_CHAIN
  const resolvedToToken =
    config?.toToken ?? checkoutToToken ?? DEFAULT_CHECKOUT_TO_TOKEN
  const resolvedToAddress = configToAddress ?? checkoutToAddress

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
    }),
    [config, resolvedToChain, resolvedToToken, resolvedToAddress]
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
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center', wordBreak: 'break-all' }}
        >
          Recipient: {resolvedToAddress}
        </Typography>
      ) : null}
      <Button variant="contained" onClick={handleOpen}>
        Deposit
      </Button>
      <LifiWidgetCheckout
        open={open}
        integrator={resolvedIntegrator}
        config={checkoutConfig}
        allowUserDestinationAddress={!resolvedToAddress}
        onRampProviders={onRampProviders}
        onClose={handleClose}
      />
    </Box>
  )
}
