import type { Token } from '@lifi/sdk'
import type { CardProps } from '@mui/material'
import type { ChangeEvent, ReactNode } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToken } from '../../hooks/useToken.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper, type FormTypeProps } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import {
  useFieldValue,
  useFieldValues,
} from '../../stores/form/useFieldValues.js'
import { useInputModeStore } from '../../stores/inputMode/useInputModeStore.js'
import { DisabledUI } from '../../types/widget.js'
import {
  formatInputAmount,
  formatTokenPrice,
  priceToTokenAmount,
} from '../../utils/format.js'
import { fitInputText } from '../../utils/input.js'
import { InputCard } from '../Card/InputCard.js'
import {
  AmountInputCardHeader,
  AmountInputCardTitle,
  FormContainer,
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from './AmountInput.style.js'
import { AmountInputEndAdornment } from './AmountInputEndAdornment.js'
import { AmountInputStartAdornment } from './AmountInputStartAdornment.js'
import { PriceFormHelperText } from './PriceFormHelperText.js'

export const AmountInput: React.FC<FormTypeProps & CardProps> = ({
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
    <AmountInputBase
      formType={formType}
      token={token}
      endAdornment={
        !disabled ? <AmountInputEndAdornment formType={formType} /> : undefined
      }
      bottomAdornment={<PriceFormHelperText formType={formType} />}
      disabled={disabled}
      {...props}
    />
  )
}

export const AmountInputBase: React.FC<
  FormTypeProps &
    CardProps & {
      token?: Token
      startAdornment?: ReactNode
      endAdornment?: ReactNode
      bottomAdornment?: ReactNode
      disabled?: boolean
    }
> = ({
  formType,
  token,
  startAdornment,
  endAdornment,
  bottomAdornment,
  disabled,
  ...props
}) => {
  const { t } = useTranslation()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const ref = useRef<HTMLInputElement>(null)

  const isEditingRef = useRef(false)
  const [formattedPriceInput, setFormattedPriceInput] = useState('')

  const amountKey = FormKeyHelper.getAmountKey(formType)
  const value = useFieldValue(amountKey)
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
      displayValue = formatInputAmount(priceValue.toFixed(2), 2)
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
      formattedValue = formatInputAmount(cleanInputValue, 2, true)
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
      formattedValue = formatInputAmount(cleanInputValue, 2)
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
      fitInputText(maxInputFontSize, minInputFontSize, ref.current)
    }
  }, [displayValue])

  const title =
    subvariant === 'custom'
      ? subvariantOptions?.custom === 'deposit'
        ? t('header.amount')
        : t('header.youPay')
      : t('header.send')

  return (
    <InputCard {...props}>
      <AmountInputCardHeader>
        <AmountInputCardTitle>{title}</AmountInputCardTitle>
        {endAdornment}
      </AmountInputCardHeader>
      <FormContainer>
        <AmountInputStartAdornment formType={formType} />
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
          />
          {bottomAdornment}
        </FormControl>
      </FormContainer>
    </InputCard>
  )
}
