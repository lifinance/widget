import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ButtonTertiary } from '../../components/ButtonTertiary.js'
import { Card } from '../../components/Card/Card.js'
import { ExecutionProgress } from '../../components/ExecutionProgress/ExecutionProgress.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { useContactSupport } from '../../hooks/useContactSupport.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { HiddenUI } from '../../types/widget.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { ExecutionDoneCard } from './ExecutionDoneCard.js'
import { StepActionsList } from './StepActionsList.js'

interface ExecutionProgressCardsProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionProgressCards: React.FC<ExecutionProgressCardsProps> = ({
  route,
  status,
}) => {
  const { t } = useTranslation()
  const { feeConfig, hiddenUI, defaultUI } = useWidgetConfig()

  const isDone = hasEnumFlag(status, RouteExecutionStatus.Done)
  const toAddress = isDone ? route.toAddress : undefined

  // Show contact support button only for failed executed transactions
  const supportId = getSourceTxHash(route)
  const showContactSupport =
    !hiddenUI?.includes(HiddenUI.ContactSupport) &&
    status === RouteExecutionStatus.Failed &&
    !!supportId
  const handleContactSupport = useContactSupport(supportId)

  const VcComponent =
    status === RouteExecutionStatus.Done ? feeConfig?._vcComponent : undefined

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card type="default" indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ExecutionProgress route={route} status={status} />
          <StepActionsList route={route} toAddress={toAddress} />
          {showContactSupport && (
            <ButtonTertiary
              variant="text"
              onClick={handleContactSupport}
              fullWidth
            >
              {t('button.contactSupport')}
            </ButtonTertiary>
          )}
        </Box>
      </Card>
      {isDone ? (
        <ExecutionDoneCard route={route} status={status} />
      ) : (
        <Card type="default" indented>
          <RouteTokens
            route={route}
            defaultExpanded={defaultUI?.transactionDetailsExpanded}
          />
        </Card>
      )}
      {VcComponent ? <VcComponent route={route} /> : null}
    </Box>
  )
}
