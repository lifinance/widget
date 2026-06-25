import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import type { CardProps } from '@mui/material'
import { Box, Skeleton, Tooltip } from '@mui/material'
import {
  type ChangeEvent,
  type JSX,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { useLimitMode } from '../../stores/navigationTabs/useLimitMode.js'
import {
  formatInputAmount,
  formatTokenAmount,
  formatTokenPrice,
  priceToTokenAmount,
  usdDecimals,
} from '../../utils/format.js'
import { getPriceImpact } from '../../utils/getPriceImpact.js'
import { fitInputText } from '../../utils/input.js'
import { CardTitle } from '../Card/CardTitle.js'
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js'
import { TokenPillButton } from '../TokenPillButton/TokenPillButton.js'
import {
  AmountCard,
  AmountDisplay,
  amountHeight,
  CardBodyRow,
  CardFooterRow,
  CardHeaderRow,
  FooterText,
  footerFontSize,
  LargeInput,
  maxInputFontSize,
  minInputFontSize,
  ToggleButton,
} from './AmountInputCard.style.js'
import { FiatValueToggle } from './FiatValueToggle.js'

export const ReceiveAmountCard: React.FC<CardProps & { mask?: boolean }> = (
  props
): JSX.Element => {
  const { t } = useTranslation()
  const amountRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const formType = 'to' as const
  const { inputMode, toggleInputMode } = useInputModeStore()
  const currentInputMode = inputMode[formType]
  const showFiat = currentInputMode === 'price'
  const { hiddenUI } = useWidgetConfig()
  const { routes, isFetching, dataUpdatedAt, refetchTime, refetch } =
    useRoutes()

  const isLimit = useLimitMode()
  const isEditingRef = useRef(false)
  const [formattedPriceInput, setFormattedPriceInput] = useState('')
  const [toChainId, toTokenAddress, toAmount] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
    FormKeyHelper.getAmountKey(formType)
  )
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const { setReceiveAmount } = useLinkedLimitFields()

  const route = routes?.[0]
  const receiveAmount = route?.toAmount
    ? formatTokenAmount(BigInt(route.toAmount), route.toToken.decimals)
    : undefined

  // Only show skeletons on the initial fetch
  const showSkeleton = isFetching && !receiveAmount

  const fiatValue =
    receiveAmount && route?.toToken.priceUSD
      ? formatTokenPrice(receiveAmount, route.toToken.priceUSD)
      : 0

  const canToggle = !!receiveAmount && !!route?.toToken.priceUSD

  const showPriceImpact = !hiddenUI?.routeCardPriceImpact

  const priceImpact =
    route && showPriceImpact
      ? getPriceImpact({
          fromAmount: BigInt(route.fromAmount),
          toAmount: BigInt(route.toAmount),
          fromToken: route.fromToken,
          toToken: route.toToken,
        })
      : undefined

  const priceImpactNode =
    priceImpact !== undefined ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <FooterText>
          {t('format.percent', { value: priceImpact, usePlusSign: true })}
        </FooterText>
        <Tooltip title={t('tooltip.priceImpact')}>
          <InfoOutlinedIcon
            sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
          />
        </Tooltip>
      </Box>
    ) : null

  const mainDisplay = showFiat
    ? t('format.currency', { value: fiatValue })
    : t('format.tokenAmount', { value: receiveAmount || '0' })

  const footerDisplay = showFiat
    ? t('format.tokenAmount', { value: receiveAmount || '0' })
    : t('format.currency', { value: fiatValue })

  // Limit-mode editable display: mirror the send card so the receive amount can
  // be typed in either token or fiat (price) mode.
  let limitDisplayValue: string
  if (isEditingRef.current) {
    limitDisplayValue = showFiat ? formattedPriceInput : (toAmount as string)
  } else if (showFiat) {
    const priceValue = formatTokenPrice(toAmount as string, toToken?.priceUSD)
    limitDisplayValue = formatInputAmount(
      priceValue.toFixed(usdDecimals),
      usdDecimals
    )
  } else {
    limitDisplayValue = toAmount as string
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run on value change
  useLayoutEffect(() => {
    if (amountRef.current) {
      fitInputText(maxInputFontSize, minInputFontSize, amountRef.current)
    }
  }, [mainDisplay])

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run on value change
  useLayoutEffect(() => {
    if (inputRef.current) {
      fitInputText(maxInputFontSize, minInputFontSize, inputRef.current)
    }
  }, [limitDisplayValue])

  // In limit mode the receive amount is user-editable and linked to the limit
  // price (editing it re-derives the price), so render an input instead of the
  // read-only route quote — keeping the same fiat toggle and price impact.
  if (isLimit) {
    const handleChange = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
      const { value: inputValue } = event.target
      isEditingRef.current = true

      if (showFiat) {
        const cleanInputValue = inputValue.replace('$', '')
        const formattedValue = formatInputAmount(
          cleanInputValue,
          usdDecimals,
          true
        )
        const tokenValue = priceToTokenAmount(formattedValue, toToken?.priceUSD)
        setFormattedPriceInput(formattedValue)
        setReceiveAmount(tokenValue)
      } else {
        const formattedValue = formatInputAmount(
          inputValue,
          toToken?.decimals,
          true
        )
        setReceiveAmount(formattedValue)
      }
    }

    const handleBlur = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
      const { value: inputValue } = event.target
      isEditingRef.current = false

      if (showFiat) {
        const cleanInputValue = inputValue.replace('$', '')
        const formattedValue = formatInputAmount(cleanInputValue, usdDecimals)
        const tokenValue = priceToTokenAmount(formattedValue, toToken?.priceUSD)
        const formattedAmount = formatInputAmount(tokenValue, toToken?.decimals)
        setReceiveAmount(formattedAmount)
      } else {
        const formattedValue = formatInputAmount(inputValue, toToken?.decimals)
        setReceiveAmount(formattedValue)
      }
    }

    return (
      <AmountCard {...props} formType={formType}>
        <CardHeaderRow>
          <CardTitle sx={{ padding: 0 }}>{t('header.buy')}</CardTitle>
          <ProgressToNextUpdate
            updatedAt={dataUpdatedAt || Date.now()}
            timeToUpdate={refetchTime}
            isLoading={isFetching}
            onClick={() => refetch()}
            sx={{ padding: 0 }}
          />
        </CardHeaderRow>
        <CardBodyRow>
          <LargeInput
            inputRef={inputRef}
            size="small"
            autoComplete="off"
            placeholder={showFiat ? '$0' : '0'}
            inputProps={{ inputMode: 'decimal' }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={
              showFiat
                ? limitDisplayValue
                  ? `$${limitDisplayValue}`
                  : ''
                : limitDisplayValue
            }
            name="toAmount"
          />
          <TokenPillButton formType={formType} />
        </CardBodyRow>
        <CardFooterRow>
          <FiatValueToggle formType={formType} />
          {priceImpactNode}
        </CardFooterRow>
      </AmountCard>
    )
  }

  return (
    <AmountCard {...props} formType={formType}>
      <CardHeaderRow>
        <CardTitle sx={{ padding: 0 }}>{t('header.receive')}</CardTitle>
      </CardHeaderRow>
      <CardBodyRow>
        {showSkeleton ? (
          <Skeleton variant="rounded" height={amountHeight} sx={{ flex: 1 }} />
        ) : (
          <AmountDisplay
            ref={amountRef}
            sx={{
              color: 'text.primary',
              opacity: receiveAmount ? 1 : 0.5,
            }}
          >
            {mainDisplay}
          </AmountDisplay>
        )}
        <TokenPillButton formType={formType} />
      </CardBodyRow>
      <CardFooterRow>
        {showSkeleton ? (
          <>
            <Skeleton
              variant="text"
              width={72}
              sx={{ fontSize: footerFontSize }}
            />
            {showPriceImpact ? (
              <Skeleton
                variant="text"
                width={56}
                sx={{ fontSize: footerFontSize }}
              />
            ) : null}
          </>
        ) : (
          <>
            <ToggleButton
              clickable={canToggle}
              onClick={canToggle ? () => toggleInputMode(formType) : undefined}
              aria-label={canToggle ? 'Toggle fiat value' : undefined}
            >
              <FooterText>{footerDisplay}</FooterText>
              {canToggle ? (
                <SwapVertIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              ) : null}
            </ToggleButton>
            {priceImpactNode}
          </>
        )}
      </CardFooterRow>
    </AmountCard>
  )
}
