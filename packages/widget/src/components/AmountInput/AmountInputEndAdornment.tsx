import { formatUnits } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import type React from 'react'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useMaxSendAmount } from '../../hooks/useMaxSendAmount.js'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import {
  AmountInputButton,
  ButtonContainer,
} from './AmountInputEndAdornment.style.js'

export const AmountInputEndAdornment: React.NamedExoticComponent<FormTypeProps> =
  memo(({ formType }: FormTypeProps): JSX.Element | null => {
    const { t } = useTranslation()
    const { getChainById } = useAvailableChains()
    const { setFieldValue } = useFieldActions()

    const [chainId, tokenAddress] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType)
    )

    const chain = getChainById(chainId)
    const { account } = useAccount({ chainType: chain?.chainType })

    const { token } = useTokenAddressBalance(chainId, tokenAddress)
    const maxAmount = useMaxSendAmount(chainId, tokenAddress)

    const handlePercentage = (percentage: number) => {
      if (maxAmount && token?.decimals) {
        const percentageAmount = (maxAmount * BigInt(percentage)) / 100n
        setFieldValue(
          FormKeyHelper.getAmountKey(formType),
          formatUnits(percentageAmount, token.decimals),
          {
            isTouched: true,
          }
        )
      }
    }

    const handleMax = () => {
      if (maxAmount && token?.decimals) {
        setFieldValue(
          FormKeyHelper.getAmountKey(formType),
          formatUnits(maxAmount, token.decimals),
          {
            isTouched: true,
          }
        )
      }
    }

    if (formType !== 'from' || !token || !account?.isConnected) {
      return null
    }

    return (
      <ButtonContainer>
        <AmountInputButton onClick={() => handlePercentage(25)}>
          25%
        </AmountInputButton>
        <AmountInputButton onClick={() => handlePercentage(50)}>
          50%
        </AmountInputButton>
        <AmountInputButton onClick={() => handlePercentage(75)}>
          75%
        </AmountInputButton>
        <AmountInputButton onClick={handleMax}>
          {t('button.max')}
        </AmountInputButton>
      </ButtonContainer>
    )
  })
