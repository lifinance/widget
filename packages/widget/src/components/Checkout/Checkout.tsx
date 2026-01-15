import type { RouteExtended, TokenAmount } from '@lifi/sdk'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import { Box } from '@mui/material'
import type React from 'react'
import { Card } from '../../components/Card/Card.js'
import { Token } from '../../components/Token/Token.js'
import type { WidgetSubvariant } from '../../types/widget'
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
          {toToken ? <Token token={toToken} impactToken={impactToken} /> : null}
        </Box>
      </Card>
    </Box>
  )
}
