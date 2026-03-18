import type { RouteExtended } from '@lifi/sdk'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box } from '@mui/material'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { Token } from '../Token/Token.js'
import { RouteToken } from './RouteToken.js'

export const RouteTokens: React.FC<{
  route: RouteExtended
  showEssentials?: boolean
}> = ({ route, showEssentials }) => {
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {fromToken ? <Token token={fromToken} /> : null}
      <Box
        sx={{
          width: 40,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowDownwardIcon sx={{ fontSize: 16 }} />
      </Box>
      {toToken ? (
        <RouteToken
          route={route}
          token={toToken}
          impactToken={fromToken}
          defaultExpanded={defaultUI?.transactionDetailsExpanded}
          showEssentials={showEssentials}
        />
      ) : null}
    </Box>
  )
}
