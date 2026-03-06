import type { RouteExtended } from '@lifi/sdk'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box } from '@mui/material'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { Token } from '../Token/Token.js'
import { TokenWithExpansion } from './TokenWithExpansion.js'

export const RouteTokens: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  const { subvariant, defaultUI } = useWidgetConfig()

  const fromToken = {
    ...route.steps[0].action.fromToken,
    amount: BigInt(route.steps[0].action.fromAmount),
  }

  const lastStepIndex = route.steps.length - 1
  const toToken = {
    ...(route.steps[lastStepIndex].execution?.toToken ??
      route.steps[lastStepIndex].action.toToken),
    amount: route.steps[lastStepIndex].execution?.toAmount
      ? BigInt(route.steps[lastStepIndex].execution.toAmount)
      : subvariant === 'custom'
        ? BigInt(route.toAmount)
        : BigInt(route.steps[lastStepIndex].estimate.toAmount),
  }

  const impactToken = {
    ...route.steps[0].action.fromToken,
    amount: BigInt(route.steps[0].action.fromAmount),
  }

  return (
    <Box>
      {fromToken ? <Token token={fromToken} /> : null}
      <Box
        sx={{
          width: '40px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowDownwardIcon sx={{ fontSize: '16px' }} />
      </Box>
      {toToken ? (
        <TokenWithExpansion
          route={route}
          token={toToken}
          impactToken={impactToken}
          defaultExpanded={defaultUI?.transactionDetailsExpanded}
        />
      ) : null}
    </Box>
  )
}
