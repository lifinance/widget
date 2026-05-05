import type { Route } from '@lifi/sdk'
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled'
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded'
import { Box, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TokenAvatar } from '../../components/Avatar/TokenAvatar.js'
import { ChainAvatar } from '../../components/ChainSelect/ChainSelect.style.js'
import { FeeBreakdownTooltip } from '../../components/FeeBreakdownTooltip.js'
import { IconTypography } from '../../components/IconTypography.js'
import { RouteNotFoundCard } from '../../components/RouteCard/RouteNotFoundCard.js'
import { TokenRate } from '../../components/TokenRate/TokenRate.js'
import { useChain } from '../../hooks/useChain.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToken } from '../../hooks/useToken.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import {
  formatDuration,
  formatTokenAmount,
  formatTokenPrice,
} from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'

/** Receive (output) quote card for checkout deposit — matches Figma before/after quote states. */
export const CheckoutReceiveCard: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [fromAmount] = useFieldValues('fromAmount')
  const [toChainId, toTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to')
  )
  const { chain } = useChain(toChainId)
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const { routes, isLoading, isFetching, isFetched } = useRoutes()

  const hasAmount = Number(fromAmount) > 0
  const route = routes?.[0] as Route | undefined
  const routeNotFound =
    hasAmount && !route && !isLoading && !isFetching && isFetched
  const showLoading = hasAmount && !route && (isLoading || isFetching)

  const toUsdZero = t('format.currency', { value: 0 })
  const priceImpactStr = route
    ? t('format.percent', {
        value: getPriceImpact({
          fromToken: route.fromToken,
          toToken: route.toToken,
          fromAmount: BigInt(route.fromAmount),
          toAmount: BigInt(route.toAmount),
        }),
        usePlusSign: true,
      })
    : '0.00%'

  const toAmountRaw = route
    ? formatTokenAmount(BigInt(route.toAmount), route.toToken.decimals)
    : '0'
  const toAmountDisplay = route
    ? t('format.tokenAmount', { value: toAmountRaw })
    : '0'

  const toUsdDisplay = route
    ? t('format.currency', {
        value: formatTokenPrice(
          BigInt(route.toAmount),
          route.toToken.priceUSD,
          route.toToken.decimals
        ),
      })
    : toUsdZero

  const executionTimeSeconds = route
    ? Math.floor(
        route.steps.reduce(
          (duration, step) => duration + step.estimate.executionDuration,
          0
        )
      )
    : 0

  const { gasCosts, feeCosts, combinedFeesUSD } = route
    ? getAccumulatedFeeCostsBreakdown(route)
    : { gasCosts: [], feeCosts: [], combinedFeesUSD: 0 }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1.5,
        p: 2,
        mb: 2,
        boxShadow: '0px 2px 8px rgba(0,0,0,.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {toToken && chain ? (
          <TokenAvatar token={toToken} chain={chain} />
        ) : (
          <Skeleton variant="circular" width={32} height={32} />
        )}
        <Box>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 500 }}
          >
            {t('header.receive')}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, fontSize: 14, lineHeight: '20px' }}
          >
            {toToken?.symbol ?? '—'}
          </Typography>
        </Box>
      </Box>

      {routeNotFound ? (
        <RouteNotFoundCard />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {showLoading ? (
                <Typography
                  sx={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: 'text.disabled',
                    '@keyframes checkoutReceiveAmountPulse': {
                      '0%, 100%': { opacity: 0.35 },
                      '50%': { opacity: 1 },
                    },
                    animation:
                      'checkoutReceiveAmountPulse 1.1s ease-in-out infinite',
                  }}
                  noWrap
                >
                  0
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: route ? 'text.primary' : 'text.disabled',
                  }}
                  noWrap
                  title={route ? toAmountRaw : undefined}
                >
                  {toAmountDisplay}
                </Typography>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flexWrap: 'wrap',
                  mt: 0.5,
                }}
              >
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {toUsdDisplay}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.secondary', fontSize: 12, opacity: 0.75 }}
                >
                  •
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {priceImpactStr}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.secondary', fontSize: 12, opacity: 0.75 }}
                >
                  •
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    minWidth: 0,
                  }}
                >
                  {chain?.logoURI ? (
                    <ChainAvatar
                      src={chain.logoURI}
                      alt=""
                      sx={{ width: 16, height: 16 }}
                    />
                  ) : null}
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {chain?.name ?? '—'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              minHeight: 28,
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                minHeight: 20,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {route ? <TokenRate route={route} /> : null}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {route ? (
                <>
                  <FeeBreakdownTooltip
                    gasCosts={gasCosts}
                    feeCosts={feeCosts}
                    gasless={!combinedFeesUSD}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconTypography
                        component="span"
                        sx={{ mr: 0.5, fontSize: 16 }}
                      >
                        <LocalGasStationRounded fontSize="inherit" />
                      </IconTypography>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {!combinedFeesUSD
                          ? t('main.fees.free')
                          : t('format.currency', {
                              value: combinedFeesUSD,
                            })}
                      </Typography>
                    </Box>
                  </FeeBreakdownTooltip>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconTypography
                      component="span"
                      sx={{ mr: 0.5, fontSize: 16 }}
                    >
                      <AccessTimeFilled fontSize="inherit" />
                    </IconTypography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {formatDuration(executionTimeSeconds, i18n.language)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconTypography
                      component="span"
                      sx={{ mr: 0.5, fontSize: 16 }}
                    >
                      <LocalGasStationRounded fontSize="inherit" />
                    </IconTypography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {toUsdZero}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconTypography
                      component="span"
                      sx={{ mr: 0.5, fontSize: 16 }}
                    >
                      <AccessTimeFilled fontSize="inherit" />
                    </IconTypography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {formatDuration(0, i18n.language)}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
