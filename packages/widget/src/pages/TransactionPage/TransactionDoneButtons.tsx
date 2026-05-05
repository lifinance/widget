import type { RouteExtended } from '@lifi/sdk'
import { Button } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { useClearAmountFields } from '../../stores/form/useClearAmountFields'
import { useFieldActions } from '../../stores/form/useFieldActions'
import { RouteExecutionStatus } from '../../stores/routes/types'
import { hasEnumFlag } from '../../utils/enum'
import { formatTokenAmount } from '../../utils/format'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { getExecutionToToken } from '../../utils/token'

interface TransactionDoneButtonsProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const TransactionDoneButtons: React.FC<TransactionDoneButtonsProps> = ({
  route,
  status,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()
  const clearAmountFields = useClearAmountFields()

  if (!hasEnumFlag(status, RouteExecutionStatus.Done)) {
    return null
  }

  const handlePartialDone = () => {
    const toToken = getExecutionToToken(route)
    if (
      toToken.chainId !== route.toToken.chainId &&
      toToken.address !== route.toToken.address
    ) {
      setFieldValue(
        'fromAmount',
        formatTokenAmount(toToken.amount, toToken.decimals),
        { isTouched: true }
      )
      setFieldValue('fromChain', toToken.chainId, { isTouched: true })
      setFieldValue('fromToken', toToken.address, { isTouched: true })
      setFieldValue('toChain', route.toToken.chainId, {
        isTouched: true,
      })
      setFieldValue('toToken', route.toToken.address, {
        isTouched: true,
      })
    } else {
      clearAmountFields()
    }
  }

  const handleClick = () => {
    if (hasEnumFlag(status, RouteExecutionStatus.Partial)) {
      handlePartialDone()
    } else {
      clearAmountFields()
    }
    navigate({ to: navigationRoutes.home, replace: true })
  }

  return (
    <Button variant="contained" fullWidth onClick={handleClick}>
      {t('button.done')}
    </Button>
  )
}
