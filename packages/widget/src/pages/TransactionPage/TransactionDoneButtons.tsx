import type { RouteExtended } from '@lifi/sdk'
import { Button } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { useFieldActions } from '../../stores/form/useFieldActions'
import { RouteExecutionStatus } from '../../stores/routes/types'
import { hasEnumFlag } from '../../utils/enum'
import { formatTokenAmount } from '../../utils/format'
import { navigationRoutes } from '../../utils/navigationRoutes'

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

  if (!hasEnumFlag(status, RouteExecutionStatus.Done)) {
    return null
  }

  const cleanFields = () => {
    setFieldValue('fromAmount', '')
    setFieldValue('toAmount', '')
  }

  const handlePartialDone = () => {
    const toToken = {
      ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
      amount: BigInt(
        route.steps.at(-1)?.execution?.toAmount ??
          route.steps.at(-1)?.estimate.toAmount ??
          route.toAmount
      ),
    }
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
      cleanFields()
    }
  }

  const handleClick = () => {
    if (hasEnumFlag(status, RouteExecutionStatus.Partial)) {
      handlePartialDone()
    } else {
      cleanFields()
    }
    navigate({ to: navigationRoutes.home, replace: true })
  }

  return (
    <Button variant="contained" fullWidth onClick={handleClick}>
      {t('button.done')}
    </Button>
  )
}
