import type { RouteExtended } from '@lifi/sdk'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { Box, IconButton } from '@mui/material'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionRow } from '../../components/ActionRow/ActionRow.js'
import { Card } from '../../components/Card/Card.js'
import { ExecutionProgress } from '../../components/Step/ExecutionProgress.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { StepActionRow } from '../../components/Step/StepActionRow.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ExecutionDoneCard } from './ExecutionDoneCard.js'
import { ExternalLink, TransactionList } from './ReceiptsCard.style.js'

interface ExecutionProgressCardsProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionProgressCards: React.FC<ExecutionProgressCardsProps> = ({
  route,
  status,
}) => {
  const { t } = useTranslation()
  const { feeConfig } = useWidgetConfig()
  const { getAddressLink } = useExplorer()
  const isDone = hasEnumFlag(status, RouteExecutionStatus.Done)
  const toAddress = isDone ? route.toAddress : undefined
  const VcComponent =
    status === RouteExecutionStatus.Done ? feeConfig?._vcComponent : undefined

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation()
    if (toAddress) {
      navigator.clipboard.writeText(toAddress)
    }
  }

  const addressLink = toAddress
    ? getAddressLink(toAddress, route.toChainId)
    : undefined

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card type="default" indented>
        <Box sx={{ p: 1 }}>
          <ExecutionProgress route={route} status={status} />
          <TransactionList>
            {route.steps.map((step) => (
              <TransactionList key={step.id}>
                {prepareActions(step.execution?.actions ?? []).map(
                  (actionsGroup, index) => (
                    <StepActionRow
                      key={index}
                      step={step}
                      actionsGroup={actionsGroup}
                    />
                  )
                )}
              </TransactionList>
            ))}
            {toAddress ? (
              <ActionRow
                variant="wallet"
                message={t('main.sentToWallet', {
                  address: shortenAddress(toAddress),
                })}
                endAdornment={
                  <>
                    <IconButton
                      size="small"
                      onClick={handleCopy}
                      sx={{ p: 0.5 }}
                    >
                      <ContentCopyRounded sx={{ fontSize: 16 }} />
                    </IconButton>
                    {addressLink ? (
                      <ExternalLink
                        href={addressLink}
                        target="_blank"
                        rel="nofollow noreferrer"
                      >
                        <OpenInNew sx={{ fontSize: 16 }} />
                      </ExternalLink>
                    ) : undefined}
                  </>
                }
              />
            ) : undefined}
          </TransactionList>
        </Box>
      </Card>
      {isDone ? (
        <ExecutionDoneCard route={route} status={status} />
      ) : (
        <Card type="default" indented>
          <RouteTokens route={route} />
        </Card>
      )}
      {VcComponent ? <VcComponent route={route} /> : null}
    </Box>
  )
}
