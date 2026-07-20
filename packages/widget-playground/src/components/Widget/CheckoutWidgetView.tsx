import { ChainType } from '@lifi/widget'
import { LifiWidgetCheckout } from '@lifi/widget-checkout'
import { meshProvider } from '@lifi/widget-provider-mesh'
import { transakProvider } from '@lifi/widget-provider-transak'
import { Box } from '@mui/material'
import { type JSX, useMemo } from 'react'
import { widgetBaseConfig } from '../../defaultWidgetConfig.js'
import { useEnvVariables } from '../../providers/EnvVariablesProvider.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'

const DEFAULT_CHECKOUT_INTEGRATOR = 'widget-transak-test'
const DEFAULT_CHECKOUT_TO_CHAIN = 8453
// USDC on Base — demo destination asset when none is configured.
const DEFAULT_CHECKOUT_TO_TOKEN = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

export function CheckoutWidgetView(): JSX.Element {
  const { config } = useConfig()
  const {
    checkoutIntegrator,
    checkoutToChain,
    checkoutToToken,
    checkoutToAddress,
  } = useEnvVariables()

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
        p: 3,
        flex: 1,
        minHeight: 320,
        width: '100%',
      }}
    >
      <LifiWidgetCheckout
        inline
        integrator={resolvedIntegrator}
        config={checkoutConfig}
        allowUserDestinationAddress={!resolvedToAddress}
        onRampProviders={onRampProviders}
      />
    </Box>
  )
}
