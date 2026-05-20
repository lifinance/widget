import { LifiWidgetCheckout } from '@lifi/widget-checkout'
import { meshProvider } from '@lifi/widget-provider-mesh'
import { transakProvider } from '@lifi/widget-provider-transak'
import { Box, Button, Typography } from '@mui/material'
import { type JSX, useCallback, useMemo, useState } from 'react'
import { widgetBaseConfig } from '../../defaultWidgetConfig.js'
import { useEnvVariables } from '../../providers/EnvVariablesProvider.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'

const DEFAULT_CHECKOUT_INTEGRATOR = 'widget-transak-test'

export function CheckoutWidgetView(): JSX.Element {
  const { config } = useConfig()
  const { checkoutIntegrator, checkoutToChain, checkoutToToken } =
    useEnvVariables()
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

  const resolvedToChain = config?.toChain ?? checkoutToChain
  const resolvedToToken = config?.toToken ?? checkoutToToken
  const checkoutConfig = {
    ...config,
    providers: config?.providers ?? widgetBaseConfig.providers,
    ...(resolvedToChain !== undefined ? { toChain: resolvedToChain } : null),
    ...(resolvedToToken !== undefined ? { toToken: resolvedToToken } : null),
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
        config={checkoutConfig}
        onRampProviders={onRampProviders}
        onClose={handleClose}
      />
    </Box>
  )
}
