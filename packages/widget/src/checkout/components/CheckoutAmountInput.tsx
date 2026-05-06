import type { Token } from '@lifi/sdk'
import type { CardProps } from '@mui/material'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  Input,
} from '../../components/AmountInput/AmountInput.style.js'
import { AmountInputEndAdornment } from '../../components/AmountInput/AmountInputEndAdornment.js'
import { AvatarBadgedDefault } from '../../components/Avatar/Avatar.js'
import { TokenAvatar } from '../../components/Avatar/TokenAvatar.js'
import { InputCard } from '../../components/Card/InputCard.js'
import { useChain } from '../../hooks/useChain.js'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper, type FormTypeProps } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { DisabledUI } from '../../types/widget.js'
import {
  formatInputAmount,
  formatTokenPrice,
  priceToTokenAmount,
  usdDecimals,
} from '../../utils/format.js'
import { fitInputText } from '../../utils/input.js'
import { useCheckoutNavigate } from '../hooks/useCheckoutNavigate.js'
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

export const CheckoutAmountInput: React.FC<FormTypeProps & CardProps> = ({
  formType,
  ...props
}) => {
  const { disabledUI } = useWidgetConfig()

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )

  const { token } = useToken(chainId, tokenAddress)

  const disabled = disabledUI?.includes(DisabledUI.FromAmount)
  return (
    <CheckoutAmountInputBase
      formType={formType}
      token={token}
      bottomAdornment={<CheckoutPriceFormHelperText formType={formType} />}
      disabled={disabled}
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
    }
> = ({
  formType,
  token,
  startAdornment,
  bottomAdornment,
  disabled,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null)

  const isEditingRef = useRef(false)
  const [formattedPriceInput, setFormattedPriceInput] = useState('')

  const amountKey = FormKeyHelper.getAmountKey(formType)
  const [value] = useFieldValues(amountKey)
  const { setFieldValue } = useFieldActions()
  const { inputMode } = useInputModeStore()

  const currentInputMode = inputMode[formType]
  let displayValue: string
  if (isEditingRef.current) {
    if (currentInputMode === 'price') {
      displayValue = formattedPriceInput
    } else {
      displayValue = value as string
    }
  } else {
    if (currentInputMode === 'price') {
      const priceValue = formatTokenPrice(value as string, token?.priceUSD)
      displayValue = formatInputAmount(
        priceValue.toFixed(usdDecimals),
        usdDecimals
      )
    } else {
      displayValue = value as string
    }
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value: inputValue } = event.target
    isEditingRef.current = true

    let formattedValue: string
    if (currentInputMode === 'price') {
      const cleanInputValue = inputValue.replace('$', '')
      formattedValue = formatInputAmount(cleanInputValue, usdDecimals, true)
      const tokenValue = priceToTokenAmount(formattedValue, token?.priceUSD)
      setFormattedPriceInput(formattedValue)
      setFieldValue(amountKey, tokenValue, { isDirty: true, isTouched: true })
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
      const cleanInputValue = inputValue.replace('$', '')
      formattedValue = formatInputAmount(cleanInputValue, usdDecimals)
      const tokenValue = priceToTokenAmount(formattedValue, token?.priceUSD)
      const formattedAmount = formatInputAmount(tokenValue, token?.decimals)
      setFieldValue(amountKey, formattedAmount, {
        isDirty: true,
        isTouched: true,
      })
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
        <CheckoutTokenFlow formType={formType} />
        {!disabled ? (
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
      <Box sx={{ px: 2, flex: 1, display: 'flex', alignItems: 'center' }}>
        <FormControl fullWidth>
          <Input
            inputRef={ref}
            size="small"
            autoComplete="off"
            placeholder={currentInputMode === 'price' ? '$0' : '0'}
            startAdornment={startAdornment}
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={
              currentInputMode === 'price'
                ? displayValue
                  ? `$${displayValue}`
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
      <Box sx={{ px: 2, pb: 2 }}>{bottomAdornment}</Box>
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
