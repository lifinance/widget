import type { RouteExtended } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useRouteExecutionMessage } from '../../hooks/useRouteExecutionMessage.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { StepStatusIndicator } from './StepStatusIndicator.js'

export const ExecutionProgress: React.FC<{
  route: RouteExtended
  status: RouteExecutionStatus
}> = ({ route, status }) => {
  const {
    feeConfig,
    subvariant,
    contractSecondaryComponent,
    contractCompactComponent,
  } = useWidgetConfig()
  const lastStep = route.steps.at(-1)
  const { title, message } = useRouteExecutionMessage(route, status)

  if (!lastStep) {
    return null
  }

  const showContractComponent =
    subvariant === 'custom' &&
    hasEnumFlag(status, RouteExecutionStatus.Done) &&
    (contractCompactComponent || contractSecondaryComponent)

  const VcComponent =
    status === RouteExecutionStatus.Done ? feeConfig?._vcComponent : undefined

  return (
    <Box>
      {!showContractComponent ? (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <StepStatusIndicator step={lastStep} />
        </Box>
      ) : (
        contractCompactComponent || contractSecondaryComponent
      )}
      {title && (
        <Typography
          sx={{
            fontSize: status === RouteExecutionStatus.Pending ? 14 : 18,
            fontWeight: status === RouteExecutionStatus.Pending ? 500 : 700,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}
      {message ? (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          {message}
        </Typography>
      ) : null}
      {VcComponent ? <VcComponent route={route} /> : null}
    </Box>
  )
}
