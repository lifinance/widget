import { formatUnits } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useGasRecommendation } from '../../hooks/useGasRecommendation.js'
import { useLinkedLimitFields } from '../../hooks/useLinkedLimitFields.js'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useLimitMode } from '../../stores/navigationTabs/useLimitMode.js'
import type { DisabledUIConfig } from '../../types/widget.js'
import { Chip, ChipContainer } from './PercentageChips.style.js'

export const PercentageChips: React.NamedExoticComponent<FormTypeProps> = memo(
  ({ formType }: FormTypeProps): JSX.Element | null => {
    const { t } = useTranslation()
    const { getChainById } = useAvailableChains()
    const { setFieldValue } = useFieldActions()
    const { disabledUI } = useWidgetConfig()
    const isLimit = useLimitMode()
    const { setSendAmount } = useLinkedLimitFields()

    const amountKey = FormKeyHelper.getAmountKey(formType)
    const isDisabled = !!disabledUI?.[amountKey as keyof DisabledUIConfig]

    const [chainId, tokenAddress] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType)
    )

    const chain = getChainById(chainId)
    const { account } = useAccount({ chainType: chain?.chainType })

    const { data } = useGasRecommendation(chainId)
    const { token } = useTokenAddressBalance(chainId, tokenAddress)

    const getMaxAmount = (): bigint => {
      if (!token?.amount) {
        return 0n
      }
      let maxAmount = token.amount
      if (chain?.nativeToken.address === tokenAddress && data?.recommended) {
        const recommendedAmount = BigInt(data.recommended.amount)
        if (token.amount > recommendedAmount) {
          maxAmount = token.amount - recommendedAmount
        }
      }
      return maxAmount
    }

    // In limit mode the send amount must flow through the linked-field
    // derivation so the receive amount recomputes; otherwise it is a plain
    // form-field write.
    const applyAmount = (value: string): void => {
      if (isLimit) {
        setSendAmount(value)
      } else {
        setFieldValue(amountKey, value, { isTouched: true })
      }
    }

    const handlePercentage = (percentage: number): void => {
      const maxAmount = getMaxAmount()
      if (maxAmount && token?.decimals) {
        const percentageAmount = (maxAmount * BigInt(percentage)) / 100n
        applyAmount(formatUnits(percentageAmount, token.decimals))
      }
    }

    const handleMax = (): void => {
      const maxAmount = getMaxAmount()
      if (maxAmount && token?.decimals) {
        applyAmount(formatUnits(maxAmount, token.decimals))
      }
    }

    if (formType !== 'from' || isDisabled || !token || !account?.isConnected) {
      return null
    }

    return (
      <ChipContainer>
        <Chip data-delay="0" onClick={() => handlePercentage(25)}>
          25%
        </Chip>
        <Chip data-delay="1" onClick={() => handlePercentage(50)}>
          50%
        </Chip>
        <Chip data-delay="2" onClick={() => handlePercentage(75)}>
          75%
        </Chip>
        <Chip data-delay="3" onClick={handleMax}>
          {t('button.max')}
        </Chip>
      </ChipContainer>
    )
  }
)
