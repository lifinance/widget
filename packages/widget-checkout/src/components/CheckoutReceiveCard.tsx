import type { Route } from '@lifi/sdk'
import {
  AvatarBadgedDefault,
  ChainAvatar,
  FeeBreakdownTooltip,
  FormKeyHelper,
  formatDuration,
  formatInputAmount,
  formatTokenAmount,
  formatTokenPrice,
  getAccumulatedFeeCostsBreakdown,
  getPriceImpact,
  IconTypography,
  ProgressToNextUpdate,
  RouteDetails,
  TokenAvatar,
  TokenRate,
  useChain,
  useFieldActions,
  useFieldValues,
  useToken,
} from '@lifi/widget/shared'
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded'
import {
  Box,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutFlowQuote } from '../hooks/useCheckoutFlowQuote.js'
import { useCheckoutRoutes } from '../hooks/useCheckoutRoutes.js'
import { useOnRampQuote } from '../hooks/useOnRampQuote.js'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'
import { formatFiat, normalizeFiatAmount } from '../utils/fiatFormat.js'
import { CheckoutRouteNotFound } from './CheckoutRouteNotFound.js'
import { TermsDisclaimer } from './TermsDisclaimer.js'

export const CheckoutReceiveCard: React.FC = () => {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const [cashFiatAmount] = useFieldValues('cashFiatAmount')
  const parsedTypedFiatAmount = Number.parseFloat(
    normalizeFiatAmount(cashFiatAmount)
  )
  const hasTypedFiatAmount =
    Number.isFinite(parsedTypedFiatAmount) && parsedTypedFiatAmount > 0

  if (fundingSource === 'cash' && !hasTypedFiatAmount) {
    return <CheckoutReceiveIdleCard />
  }

  return <CheckoutReceiveCardWithRoutes />
}

const CheckoutReceiveIdleCard: React.FC = () => {
  const { t } = useTranslation()
  const [toChainId, toTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to')
  )
  const { chain } = useChain(toChainId)
  const { token: toToken } = useToken(toChainId, toTokenAddress)

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 2,
        mb: 2,
        boxShadow: '0px 2px 8px rgba(0,0,0,.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {toToken && chain ? (
          <TokenAvatar token={toToken} chain={chain} />
        ) : (
          <AvatarBadgedDefault />
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1,
              color: 'text.disabled',
            }}
            noWrap
          >
            0
          </Typography>
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
              sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 500 }}
            >
              {t('format.currency', { value: 0 })}
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
                sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 500 }}
              >
                {chain?.name ?? '—'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const CheckoutReceiveCardWithRoutes: React.FC = () => {
  const { t, i18n } = useTranslation()
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const isCash = fundingSource === 'cash'
  const [expanded, setExpanded] = useState(false)
  const { setFieldValue } = useFieldActions()
  const onRampQuote = useOnRampQuote()
  const [fromAmount, cashFiatAmount] = useFieldValues(
    'fromAmount',
    'cashFiatAmount'
  )
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
    refetch,
  } = useCheckoutRoutes()
  const {
    depositAddress,
    isLoading: quoteLoading,
    isFetching: quoteFetching,
    isFetched: quoteFetched,
    isError: quoteError,
  } = useCheckoutFlowQuote()

  const parsedTypedFiatAmount = Number.parseFloat(
    normalizeFiatAmount(cashFiatAmount)
  )
  const hasTypedFiatAmount =
    Number.isFinite(parsedTypedFiatAmount) && parsedTypedFiatAmount > 0
  const parsedAmount = Number.parseFloat(
    typeof fromAmount === 'string'
      ? fromAmount.replace(',', '.')
      : `${fromAmount ?? ''}`
  )
  const hasAmount =
    (!isCash || hasTypedFiatAmount) &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0
  const route = routes?.[0] as Route | undefined
  const routeNotFound =
    hasAmount && !route && !isLoading && !isFetching && isFetched
  // Non-wallet flows need a deposit address; a quote without one can't proceed.
  const depositUnavailable =
    fundingSource !== 'wallet' &&
    Boolean(route) &&
    quoteFetched &&
    !quoteLoading &&
    !quoteFetching &&
    !quoteError &&
    !depositAddress
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
    if (!isCash && !route) {
      return
    }
    setExpanded((prev) => !prev)
  }

  const estimatedFundingAmount = onRampQuote.data?.funding?.estimatedAmount
  useEffect(() => {
    if (!isCash) {
      return
    }
    if (!hasTypedFiatAmount || onRampQuote.isError) {
      if (!fromAmount) {
        return
      }
      setFieldValue(FormKeyHelper.getAmountKey('from'), '', {
        isDirty: true,
        isTouched: true,
      })
      return
    }
    if (
      onRampQuote.isDebouncePending ||
      !onRampQuote.isReady ||
      !estimatedFundingAmount
    ) {
      return
    }
    setFieldValue(
      FormKeyHelper.getAmountKey('from'),
      formatInputAmount(estimatedFundingAmount),
      { isDirty: true, isTouched: true }
    )
  }, [
    fromAmount,
    hasTypedFiatAmount,
    isCash,
    estimatedFundingAmount,
    onRampQuote.isError,
    onRampQuote.isDebouncePending,
    onRampQuote.isReady,
    setFieldValue,
  ])

  const cashFees = onRampQuote.data?.fees
  const cashFeeRows = cashFees?.breakdown?.length
    ? cashFees.breakdown.map((fee, index) => ({
        label:
          fee.name ||
          fee.label ||
          fee.type ||
          t('checkout.cashQuote.feeFallback', { index: index + 1 }),
        value: formatFiat(fee.amount, cashFees.currency, i18n.language),
      }))
    : cashFees?.total?.amount
      ? [
          {
            label: t('checkout.cashQuote.totalFeesLabel'),
            value: formatFiat(
              cashFees.total.amount,
              cashFees.currency,
              i18n.language
            ),
          },
        ]
      : []
  const minimumReceived = route
    ? `${t('format.tokenAmount', {
        value: formatTokenAmount(
          BigInt(route.toAmountMin),
          route.toToken.decimals
        ),
      })} ${route.toToken.symbol}`
    : null

  // Only skeleton when there is nothing to show yet; refetches keep prior rows.
  const hasCashDetails = cashFeeRows.length > 0 || Boolean(minimumReceived)
  const cashDetailsPending =
    isCash &&
    hasTypedFiatAmount &&
    !onRampQuote.isError &&
    !hasCashDetails &&
    (onRampQuote.isLoading ||
      onRampQuote.isFetching ||
      onRampQuote.isDebouncePending ||
      (Boolean(estimatedFundingAmount) && !route))
  const hasExpandableContent = isCash
    ? hasTypedFiatAmount &&
      (cashDetailsPending || cashFeeRows.length > 0 || Boolean(minimumReceived))
    : Boolean(route)

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {toToken && chain ? (
            <TokenAvatar token={toToken} chain={chain} />
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
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
            onClick={() => {
              refetch()
              if (isCash) {
                onRampQuote.refetch()
              }
            }}
          />
        ) : null}
      </Box>

      {routeNotFound || depositUnavailable ? (
        <CheckoutRouteNotFound />
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
                {!isCash ? (
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: 12,
                        opacity: 0.75,
                      }}
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
                  </>
                ) : null}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    opacity: 0.75,
                  }}
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
              disabled={!hasExpandableContent}
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
                transform:
                  expanded && hasExpandableContent
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
              }}
            >
              <ExpandMoreRounded sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {!isCash ? (
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
          ) : null}
          <Collapse in={expanded}>
            {isCash ? (
              hasExpandableContent ? (
                <Stack spacing={0.75} sx={{ pt: 0.5, minHeight: 45 }}>
                  {cashDetailsPending ? (
                    <>
                      <Skeleton variant="text" width="70%" height={18} />
                      <Skeleton variant="text" width="55%" height={18} />
                    </>
                  ) : (
                    cashFeeRows.map((row, index) => (
                      <Box
                        key={`${row.label}-${index}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 12, color: 'text.secondary' }}
                        >
                          {row.label}
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                          {row.value}
                        </Typography>
                      </Box>
                    ))
                  )}
                  {!cashDetailsPending && minimumReceived ? (
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {t('checkout.cashQuote.refundNote', {
                        value: minimumReceived,
                      })}
                    </Typography>
                  ) : null}
                </Stack>
              ) : null
            ) : route ? (
              <RouteDetails route={route} />
            ) : null}
          </Collapse>
        </>
      )}
      <TermsDisclaimer />
    </Box>
  )
}
