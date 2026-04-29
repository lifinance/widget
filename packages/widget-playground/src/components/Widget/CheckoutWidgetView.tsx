import { type CheckoutModalRef, LifiWidgetCheckout } from '@lifi/widget'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useRef } from 'react'
import { widgetBaseConfig } from '../../defaultWidgetConfig.js'
import { useEnvVariables } from '../../providers/EnvVariablesProvider.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'

/** Default on-ramp target for Path checkout (Lido stETH on Ethereum). Playground `config` overrides when set. */
const DEFAULT_CHECKOUT_ONRAMP_TARGET = {
  toChain: 1,
  toToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
} as const

export function CheckoutWidgetView() {
  const { config } = useConfig()
  const { onrampSessionApiUrl } = useEnvVariables()
  const checkoutRef = useRef<CheckoutModalRef>(null)

  const handleOpen = useCallback(() => {
    checkoutRef.current?.open()
  }, [])

  const checkoutConfig = {
    ...config,
    providers: config?.providers ?? widgetBaseConfig.providers,
    toChain: config?.toChain ?? DEFAULT_CHECKOUT_ONRAMP_TARGET.toChain,
    toToken: config?.toToken ?? DEFAULT_CHECKOUT_ONRAMP_TARGET.toToken,
  }

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
        Path v1 checkout — opens as a centered widget via ref (
        <code>open()</code> / <code>close()</code>).
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Deposit
      </Button>
      <LifiWidgetCheckout
        ref={checkoutRef}
        integrator={config?.integrator ?? 'li.fi-playground'}
        onrampSessionApiUrl={onrampSessionApiUrl?.trim() || undefined}
        config={checkoutConfig}
        onClose={() => {}}
      />
    </Box>
  )
}
