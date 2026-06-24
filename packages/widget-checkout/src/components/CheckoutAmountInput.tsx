import type { Token } from '@lifi/sdk'
import {
  AmountInputEndAdornment,
  AvatarBadgedDefault,
  FormControl,
  FormKeyHelper,
  type FormTypeProps,
  fitInputText,
  formatInputAmount,
  formatTokenPrice,
  Input,
  InputCard,
  priceToTokenAmount,
  TokenAvatar,
  usdDecimals,
  useChain,
  useFieldActions,
  useFieldValues,
  useInputModeStore,
  useToken,
  useWidgetConfig,
} from '@lifi/widget/shared'
import type { CardProps } from '@mui/material'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../hooks/useCheckoutNavigate.js'
import { useIsWalletFundedFlow } from '../hooks/useIsWalletFundedFlow.js'
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import { getCurrencySymbol } from '../utils/fiatFormat.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'
import { CheckoutPriceFormHelperText } from './CheckoutPriceFormHelperText.js'

const CheckoutInputCard: React.FC<ComponentProps<typeof InputCard>> = styled(
  InputCard
)(({ theme }) => ({
  border: 'none',
  boxShadow: '0px 2px 4px rgba(0,0,0,0.02)',
  backgroundColor: theme.vars.palette.background.paper,
  minHeight: 168,
  display: 'flex',
  flexDirection: 'column',
}))

export type CheckoutAmountInputProps = FormTypeProps &
  CardProps & {
    sendSlot?: ReactNode
    presetsSlot?: ReactNode
  }

export const CheckoutAmountInput: React.FC<CheckoutAmountInputProps> = ({
  formType,
  sendSlot,
  presetsSlot,
  ...props
}) => {
  const { disabledUI } = useWidgetConfig()

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )

  const { token } = useToken(chainId, tokenAddress)

  const disabled = disabledUI?.fromAmount
  return (
    <CheckoutAmountInputBase
      formType={formType}
      token={token}
      bottomAdornment={<CheckoutPriceFormHelperText formType={formType} />}
      disabled={disabled}
      sendSlot={sendSlot}
      presetsSlot={presetsSlot}
      {...props}
    />
  )
}

const CheckoutAmountInputBase: React.FC<
  FormTypeProps &
    CardProps & {
      token?: Token
      startAdornment?: ReactNode
      bottomAdornment?: ReactNode
      disabled?: boolean
      sendSlot?: ReactNode
      presetsSlot?: ReactNode
    }
> = ({
  formType,
  token,
  startAdornment,
  bottomAdornment,
  disabled,
  sendSlot,
  presetsSlot,
  ...props
}) => {
  const { i18n } = useTranslation()
  const ref = useRef<HTMLInputElement>(null)

  const isEditingRef = useRef(false)
  const [formattedPriceInput, setFormattedPriceInput] = useState('')

  const amountKey = FormKeyHelper.getAmountKey(formType)
  const [value] = useFieldValues(amountKey)
  const { setFieldValue } = useFieldActions()
  const { inputMode } = useInputModeStore()
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const fiatCurrency = useFiatCurrencyStore((s) => s.currency)
  const isWalletFunded = useIsWalletFundedFlow()
  const isCashFlow = fundingSource === 'cash'
  const [cashFiatAmount] = useFieldValues('cashFiatAmount')

  const currentInputMode = inputMode[formType]
  let displayValue: string
  if (isEditingRef.current) {
    if (currentInputMode === 'price') {
      displayValue = isCashFlow ? cashFiatAmount : formattedPriceInput
    } else {
      displayValue = value as string
    }
  } else {
    if (currentInputMode === 'price') {
      if (isCashFlow) {
        displayValue = formatInputAmount(cashFiatAmount, usdDecimals)
      } else {
        const priceValue = formatTokenPrice(value as string, token?.priceUSD)
        displayValue = formatInputAmount(
          priceValue.toFixed(usdDecimals),
          usdDecimals
        )
      }
    } else {
      displayValue = value as string
    }
  }

  const currencyPrefix = useMemo(
    () =>
      currentInputMode === 'price'
        ? getCurrencySymbol(fiatCurrency, i18n.language)
        : '',
    [currentInputMode, fiatCurrency, i18n.language]
  )
  const stripCurrencyPrefix = (input: string): string =>
    currencyPrefix ? input.split(currencyPrefix).join('').trim() : input

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value: inputValue } = event.target
    isEditingRef.current = true

    let formattedValue: string
    if (currentInputMode === 'price') {
      const cleanInputValue = stripCurrencyPrefix(inputValue)
      formattedValue = formatInputAmount(cleanInputValue, usdDecimals, true)
      setFormattedPriceInput(formattedValue)
      if (isCashFlow) {
        setFieldValue('cashFiatAmount', formattedValue, {
          isDirty: true,
          isTouched: true,
        })
        setFieldValue(amountKey, '', { isDirty: true, isTouched: true })
      } else {
        const tokenValue = priceToTokenAmount(formattedValue, token?.priceUSD)
        setFieldValue(amountKey, tokenValue, { isDirty: true, isTouched: true })
      }
    } else {
      formattedValue = formatInputAmount(inputValue, token?.decimals, true)
      setFieldValue(amountKey, formattedValue, {
        isDirty: true,
        isTouched: true,
      })
    }
  }

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value: inputValue } = event.target
    isEditingRef.current = false

    let formattedValue: string
    if (currentInputMode === 'price') {
      const cleanInputValue = stripCurrencyPrefix(inputValue)
      formattedValue = formatInputAmount(cleanInputValue, usdDecimals)
      if (isCashFlow) {
        setFieldValue('cashFiatAmount', formattedValue, {
          isDirty: true,
          isTouched: true,
        })
        if (!formattedValue) {
          setFieldValue(amountKey, '', { isDirty: true, isTouched: true })
        }
      } else {
        const tokenValue = priceToTokenAmount(formattedValue, token?.priceUSD)
        const formattedAmount = formatInputAmount(tokenValue, token?.decimals)
        setFieldValue(amountKey, formattedAmount, {
          isDirty: true,
          isTouched: true,
        })
      }
    } else {
      formattedValue = formatInputAmount(inputValue, token?.decimals)
      setFieldValue(amountKey, formattedValue, {
        isDirty: true,
        isTouched: true,
      })
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need run effect on value change
  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(48, 16, ref.current)
    }
  }, [displayValue])

  return (
    <CheckoutInputCard {...props}>
      <Box
        sx={{
          px: 2,
          pt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        {sendSlot ?? <CheckoutTokenFlow formType={formType} />}
        {!disabled && isWalletFunded ? (
          <Box
            sx={{
              '& > div': {
                p: '0 !important',
                gap: 0.75,
              },
              '& button': {
                px: 1.25,
                minWidth: 48,
              },
            }}
          >
            <AmountInputEndAdornment formType={formType} />
          </Box>
        ) : null}
      </Box>
      <Box
        sx={{ px: 2, pt: 1.5, flex: 1, display: 'flex', alignItems: 'center' }}
      >
        <FormControl fullWidth>
          <Input
            inputRef={ref}
            size="small"
            autoComplete="off"
            placeholder={
              currentInputMode === 'price' ? `${currencyPrefix}0` : '0'
            }
            startAdornment={startAdornment}
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={
              currentInputMode === 'price'
                ? displayValue
                  ? `${currencyPrefix}${displayValue}`
                  : ''
                : displayValue
            }
            name={amountKey}
            disabled={disabled}
            required
            sx={{
              fontSize: 48,
              lineHeight: 1.05,
              '.MuiInputBase-input': {
                height: 40,
                paddingLeft: 0,
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          px: 2,
          pt: presetsSlot ? 1.5 : 0.5,
          pb: presetsSlot ? 0 : 2,
        }}
      >
        {bottomAdornment}
      </Box>
      {presetsSlot ? (
        <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>{presetsSlot}</Box>
      ) : null}
    </CheckoutInputCard>
  )
}

const CheckoutTokenFlow: React.FC<FormTypeProps> = ({ formType }) => {
  const { t } = useTranslation()
  const navigate = useCheckoutNavigate()
  const [fromChainId, fromTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )
  const { chain } = useChain(fromChainId)
  const { token } = useToken(fromChainId, fromTokenAddress)
  const isInteractive = formType === 'from'

  const handleClick = () => {
    if (!isInteractive) {
      return
    }

    navigate({ to: `/${checkoutNavigationRoutes.fromToken}` })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={handleClick}
        disabled={!isInteractive}
        aria-label={
          token?.symbol
            ? `${t('main.select')} ${token.symbol}`
            : t('main.select')
        }
        sx={{
          border: 0,
          bgcolor: 'transparent',
          p: 0,
          m: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: isInteractive ? 'pointer' : 'default',
        }}
      >
        {token && chain ? (
          <TokenAvatar
            token={token}
            chain={chain}
            tokenAvatarSize={32}
            chainAvatarSize={12}
          />
        ) : (
          <AvatarBadgedDefault />
        )}
        <Box sx={{ minWidth: 0, textAlign: 'left' }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.1,
              color: 'text.secondary',
            }}
          >
            {t('header.send')}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontSize: 14,
              fontWeight: 700,
              lineHeight: '20px',
              color: 'text.primary',
            }}
          >
            {token?.symbol ?? t('main.select')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
