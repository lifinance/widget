import type { RouteExtended, TokenAmount } from '@lifi/sdk'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/material'
import type React from 'react'
import { useState } from 'react'
import { Card } from '../../components/Card/Card.js'
import { Token } from '../../components/Token/Token.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { WidgetSubvariant } from '../../types/widget'
import { CardIconButton } from '../Card/CardIconButton.js'
import { TransactionDetails2 } from '../TransactionDetails.js'
import { StepExecution } from './StepExecution.js'

interface CheckoutProps {
  route: RouteExtended
  subvariant?: WidgetSubvariant
}

export const Checkout: React.FC<CheckoutProps> = ({ route, subvariant }) => {
  const step = route.steps[0] // TODO: other steps as well

  const fromToken: TokenAmount = {
    ...step.action.fromToken,
    amount: BigInt(step.action.fromAmount),
  }

  const toToken: TokenAmount = {
    ...(step.execution?.toToken ?? step.action.toToken),
    amount: step.execution?.toAmount
      ? BigInt(step.execution.toAmount)
      : subvariant === 'custom'
        ? BigInt(route.toAmount)
        : BigInt(step.estimate.toAmount),
  }

  const impactToken: TokenAmount = {
    ...step.action.fromToken,
    amount: BigInt(step.action.fromAmount),
  }

  const { defaultUI } = useWidgetConfig()
  const [cardExpanded, setCardExpanded] = useState(
    defaultUI?.transactionDetailsExpanded ?? false
  )

  const toggleCard = () => {
    setCardExpanded((cardExpanded) => !cardExpanded)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <StepExecution step={step} />
      <Card type="default">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            py: 2,
            px: 2,
          }}
        >
          {fromToken ? <Token token={fromToken} /> : null}
          <ArrowDownward sx={{ color: 'text.primary', mx: 1 }} />
          {toToken ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Token token={toToken} impactToken={impactToken} />
              <CardIconButton onClick={toggleCard} size="small">
                {cardExpanded ? (
                  <ExpandLess fontSize="inherit" />
                ) : (
                  <ExpandMore fontSize="inherit" />
                )}
              </CardIconButton>
            </Box>
          ) : null}
          <TransactionDetails2 route={route} cardExpanded={cardExpanded} />
        </Box>
      </Card>
    </Box>
  )
}
