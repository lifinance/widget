import type { Route } from '@lifi/sdk'
import {
  ChainAvatar,
  FeeBreakdownTooltip,
  FormKeyHelper,
  formatDuration,
  formatTokenAmount,
  formatTokenPrice,
  getAccumulatedFeeCostsBreakdown,
  getPriceImpact,
  IconTypography,
  ProgressToNextUpdate,
  RouteDetails,
  RouteNotFoundCard,
  TokenAvatar,
  TokenRate,
  useChain,
  useFieldValues,
  useToken,
} from '@lifi/widget/shared'
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded'
import { Box, Collapse, IconButton, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutRoutes } from '../hooks/useCheckoutRoutes.js'
export const CheckoutReceiveCard: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [fromAmount] = useFieldValues('fromAmount')
  const [toChainId, toTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to')
  )
  const { chain } = useChain(toChainId)
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
  } = useCheckoutRoutes()

  const parsedAmount = Number.parseFloat(
    typeof fromAmount === 'string'
      ? fromAmount.replace(',', '.')
      : `${fromAmount ?? ''}`
  )
  const hasAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
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

  const handleToggleExpanded = () => {
    if (!route) {
      return
    }
    setExpanded((prev) => !prev)
  }

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
        {hasAmount ? (
          <ProgressToNextUpdate
            updatedAt={dataUpdatedAt}
            timeToUpdate={refetchTime}
            isLoading={isLoading || (isFetching && !route)}
          />
        ) : null}
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
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
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
            <IconButton
              size="small"
              onClick={handleToggleExpanded}
              disabled={!route}
              aria-label={t('main.route')}
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1.5,
                bgcolor: 'action.hover',
                flexShrink: 0,
                alignSelf: 'flex-start',
                mt: 0.25,
                transition: 'transform 0.2s',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMoreRounded sx={{ fontSize: 16 }} />
            </IconButton>
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
                          fontWeight: 600,
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
                        fontWeight: 600,
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
                        fontWeight: 600,
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
                        fontWeight: 600,
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
          <Collapse in={expanded} unmountOnExit>
            {route ? <RouteDetails route={route} /> : null}
          </Collapse>
        </>
      )}
    </Box>
  )
}
