import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { Skeleton } from '@mui/material'
import { type JSX, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { formatTokenAmount } from '../../utils/format.js'
import { FooterText, footerFontSize } from './AmountInputCard.style.js'
import { BalanceContainer } from './BalanceDisplay.style.js'

export const BalanceDisplay: React.NamedExoticComponent<FormTypeProps> = memo(
  ({ formType }: FormTypeProps): JSX.Element | null => {
    const { t } = useTranslation()
    const [chainId, tokenAddress] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType)
    )

    const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress)

    if (isLoading && tokenAddress) {
      return (
        <Skeleton variant="text" width={72} sx={{ fontSize: footerFontSize }} />
      )
    }

    if (!token?.amount) {
      return null
    }

    const tokenAmount = formatTokenAmount(token.amount, token.decimals)

    return (
      <BalanceContainer>
        <FooterText title={tokenAmount}>
          {t('format.tokenAmount', { value: tokenAmount })}
        </FooterText>
        <AccountBalanceWalletOutlinedIcon
          sx={{ fontSize: 16, color: 'text.secondary' }}
        />
      </BalanceContainer>
    )
  }
)
