import type { RouteExtended, TokenAmount } from '@lifi/sdk'
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
  const step = route.steps[0]

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
      {step?.execution && <StepExecution step={step} />}
      <Card type="default">
        <Box
          sx={{
            py: 1,
          }}
        >
          {fromToken ? <Token token={fromToken} px={2} py={1} /> : null}
          {toToken ? (
            <Token
              token={toToken}
              impactToken={impactToken}
              enableImpactTokenTooltip
              px={2}
              py={1}
            />
          ) : null}
        </Box>
      </Card>
    </Box>
  )
}
