import type { RouteExtended } from '@lifi/sdk'
import {
  ButtonTertiary,
  Card,
  ExecutionDoneCard,
  ExecutionStatusCard,
  getSourceTxHash,
  hasEnumFlag,
  RouteExecutionStatus,
  RouteTokens,
  StatusIcon,
  useContactSupport,
  useExecutionRows,
  useRouteExecutionMessage,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Box } from '@mui/material'
import { domMax, LazyMotion, MotionConfig } from 'motion/react'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

interface CheckoutExecutionProgressProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const CheckoutExecutionProgress = ({
  route,
  status,
}: CheckoutExecutionProgressProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    mode,
    hiddenUI,
    defaultUI,
    contractCompactComponent,
    contractSecondaryComponent,
  } = useWidgetConfig()
  const { title, message } = useRouteExecutionMessage(route, status)

  const isDone = hasEnumFlag(status, RouteExecutionStatus.Done)
  const rows = useExecutionRows(route, isDone ? route.toAddress : undefined)

  const showContract =
    mode === 'custom' &&
    isDone &&
    !!(contractCompactComponent || contractSecondaryComponent)

  const iconSlot = showContract ? (
    contractCompactComponent || contractSecondaryComponent
  ) : (
    <StatusIcon route={route} status={status} />
  )

  const footerSlot = isDone ? (
    <ExecutionDoneCard route={route} status={status} />
  ) : (
    <Card type="default" indented>
      <RouteTokens
        route={route}
        defaultExpanded={defaultUI?.transactionDetailsExpanded}
      />
    </Card>
  )

  const supportId = getSourceTxHash(route)
  const showContactSupport =
    !hiddenUI?.contactSupport &&
    status === RouteExecutionStatus.Failed &&
    !!supportId
  const handleContactSupport = useContactSupport(supportId)

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ExecutionStatusCard
            title={title}
            description={message}
            rows={rows}
            iconSlot={iconSlot}
            footerSlot={footerSlot}
          />
          {showContactSupport ? (
            <ButtonTertiary
              variant="text"
              onClick={handleContactSupport}
              fullWidth
            >
              {t('button.contactSupport')}
            </ButtonTertiary>
          ) : null}
        </Box>
      </MotionConfig>
    </LazyMotion>
  )
}
