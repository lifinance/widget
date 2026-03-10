import type { RouteExtended } from '@lifi/sdk'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import Wallet from '@mui/icons-material/Wallet'
import { Box, IconButton } from '@mui/material'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useExplorer } from '../../hooks/useExplorer.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { shortenAddress } from '../../utils/wallet.js'
import { StepTransactionLink } from './TransactionLink.js'
import {
  ExternalLinkIcon,
  StatusIconCircle,
  TransactionLinkContainer,
  TransactionLinkLabel,
} from './TransactionLink.style.js'

const isRouteCompleted = (route: RouteExtended) => {
  const lastStep = route.steps.at(-1)
  const lastAction = lastStep?.execution?.actions?.at(-1)
  return lastAction?.status === 'DONE'
}

export const RouteTransactions: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  const { t } = useTranslation()
  const { getAddressLink } = useExplorer()
  const completed = isRouteCompleted(route)
  const toAddress = route.toAddress

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {route.steps.map((step) => (
        <Box
          key={step.id}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
        >
          {prepareActions(step.execution?.actions ?? []).map(
            (actionsGroup, index) => (
              <StepTransactionLink
                key={index}
                step={step}
                actionsGroup={actionsGroup}
              />
            )
          )}
        </Box>
      ))}
      {completed && toAddress ? (
        <TransactionLinkContainer>
          <StatusIconCircle>
            <Wallet color="success" sx={{ fontSize: 16 }} />
          </StatusIconCircle>
          <TransactionLinkLabel>
            {t('main.sentToWallet', {
              address: shortenAddress(toAddress),
            })}
          </TransactionLinkLabel>
          <IconButton size="small" onClick={handleCopy} sx={{ p: 0.5 }}>
            <ContentCopyRounded sx={{ fontSize: 16 }} />
          </IconButton>
          {addressLink ? (
            <ExternalLinkIcon
              href={addressLink}
              target="_blank"
              rel="nofollow noreferrer"
            >
              <OpenInNew sx={{ fontSize: 16 }} />
            </ExternalLinkIcon>
          ) : null}
        </TransactionLinkContainer>
      ) : null}
    </Box>
  )
}
