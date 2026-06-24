import type { CardProps } from '@mui/material'
import { type ChangeEvent, type JSX, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useToken } from '../../hooks/useToken.js'
import { FormKeyHelper, type FormTypeProps } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { formatInputAmount } from '../../utils/format.js'
import { TokenAvatar } from '../Avatar/TokenAvatar.js'
import { CardTitle } from '../Card/CardTitle.js'
import {
  AmountCard,
  CardBodyRow,
  CardHeaderRow,
  LargeInput,
  TokenChip,
  TokenSymbol,
} from '../LimitOrderCard/LimitOrderCard.style.js'

/**
 * Editable amount card for limit mode. The send (`from`) and receive (`to`)
 * amounts are linked through `useLinkedLimitFields`: editing one re-derives the
 * limit price or the other amount, so both stay consistent.
 */
export const LimitAmountCard: React.FC<FormTypeProps & CardProps> = ({
  formType,
  ...props
}): JSX.Element => {
  const { t } = useTranslation()
  const isEditingRef = useRef(false)
  const [inputValue, setInputValue] = useState('')

  const [chainId, tokenAddress, amount] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
    FormKeyHelper.getAmountKey(formType)
  )
  const { token } = useToken(chainId, tokenAddress)
  const { chain } = useChain(chainId)
  const { setSendAmount, setReceiveAmount } = useLinkedLimitFields()

  const applyAmount = formType === 'from' ? setSendAmount : setReceiveAmount

  // Mirror the linked field value, but don't yank it while the user types.
  useEffect(() => {
    if (!isEditingRef.current) {
      setInputValue((amount as string) ?? '')
    }
  }, [amount])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    isEditingRef.current = true
    const formatted = formatInputAmount(
      event.target.value,
      token?.decimals,
      true
    )
    setInputValue(formatted)
    applyAmount(formatted)
  }

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    isEditingRef.current = false
    const formatted = formatInputAmount(event.target.value, token?.decimals)
    setInputValue(formatted)
    applyAmount(formatted)
  }

  return (
    <AmountCard {...props}>
      <CardHeaderRow>
        <CardTitle sx={{ padding: 0 }}>
          {t(formType === 'from' ? 'header.sell' : 'header.buy')}
        </CardTitle>
      </CardHeaderRow>
      <CardBodyRow>
        <LargeInput
          size="small"
          autoComplete="off"
          placeholder="0"
          inputProps={{ inputMode: 'decimal' }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={inputValue}
          name={FormKeyHelper.getAmountKey(formType)}
        />
        {token ? (
          <TokenChip>
            <TokenAvatar
              token={token}
              chain={chain}
              tokenAvatarSize={20}
              chainAvatarSize={10}
            />
            <TokenSymbol>{token.symbol}</TokenSymbol>
          </TokenChip>
        ) : null}
      </CardBodyRow>
    </AmountCard>
  )
}
