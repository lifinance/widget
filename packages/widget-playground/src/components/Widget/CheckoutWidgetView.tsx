import { LifiWidgetCheckout } from '@lifi/widget-checkout'
import { meshProvider } from '@lifi/widget-provider-mesh'
import { transakProvider } from '@lifi/widget-provider-transak'
import { Box, Button, Typography } from '@mui/material'
import { type JSX, useCallback, useMemo, useState } from 'react'
import { widgetBaseConfig } from '../../defaultWidgetConfig.js'
import { useEnvVariables } from '../../providers/EnvVariablesProvider.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'

// TODO(cleanup-remove-playground-hardcoded-checkout-defaults): Replace these literals with
// explicit env/config contract defaults once migration is complete.
/** Default checkout target for Mesh/Transak demos (native ETH on Ethereum). Playground `config` overrides when set. */
const DEFAULT_CHECKOUT_ONRAMP_TARGET = {
  toChain: 1,
  toToken: '0x0000000000000000000000000000000000000000',
} as const

const DEFAULT_CHECKOUT_CORE_API_URL = 'https://develop.li.quest'
const DEFAULT_CHECKOUT_INTEGRATOR = 'local-test'

export function CheckoutWidgetView(): JSX.Element {
  const { config } = useConfig()
  const {
    onrampSessionApiUrl,
    checkoutIntegrator,
    checkoutToChain,
    checkoutToToken,
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

  const checkoutConfig = {
    ...config,
    providers: config?.providers ?? widgetBaseConfig.providers,
    toChain:
      config?.toChain ??
      checkoutToChain ??
      DEFAULT_CHECKOUT_ONRAMP_TARGET.toChain,
    toToken:
      config?.toToken ??
      checkoutToToken ??
      DEFAULT_CHECKOUT_ONRAMP_TARGET.toToken,
  }

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
      <Button variant="contained" onClick={handleOpen}>
        Deposit
      </Button>
      <LifiWidgetCheckout
        open={open}
        integrator={resolvedIntegrator}
        onrampSessionApiUrl={
          onrampSessionApiUrl?.trim() || DEFAULT_CHECKOUT_CORE_API_URL
        }
        config={checkoutConfig}
        onRampProviders={onRampProviders}
        onClose={handleClose}
      />
    </Box>
  )
}
