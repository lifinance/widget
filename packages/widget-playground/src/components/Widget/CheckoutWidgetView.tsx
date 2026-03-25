import {
  type CheckoutDrawerRef,
  LifiWidgetCheckout,
} from '@lifi/widget-checkout'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useRef } from 'react'
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
  const checkoutRef = useRef<CheckoutDrawerRef>(null)

  const handleOpen = useCallback(() => {
    checkoutRef.current?.open()
  }, [])

  const integrator = config?.integrator ?? 'li.fi-playground'

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
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Path v1 checkout — opens as a centered widget via ref (
        <code>open()</code> / <code>close()</code>).
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Deposit
      </Button>
      <LifiWidgetCheckout
        ref={checkoutRef}
        integrator={integrator}
        {...(onrampSessionApiUrl?.trim()
          ? { onrampSessionApiUrl: onrampSessionApiUrl.trim() }
          : {})}
        widget={
          config
            ? {
                providers: config.providers,
                sdkConfig: config.sdkConfig,
                useRelayerRoutes: config.useRelayerRoutes,
                buildUrl: config.buildUrl,
                chains: config.chains,
                tokens: config.tokens,
                walletConfig: config.walletConfig,
                apiKey: config.apiKey,
                toChain:
                  config.toChain ?? DEFAULT_CHECKOUT_ONRAMP_TARGET.toChain,
                toToken:
                  config.toToken ?? DEFAULT_CHECKOUT_ONRAMP_TARGET.toToken,
              }
            : {
                toChain: DEFAULT_CHECKOUT_ONRAMP_TARGET.toChain,
                toToken: DEFAULT_CHECKOUT_ONRAMP_TARGET.toToken,
              }
        }
        onClose={() => {}}
      />
    </Box>
  )
}
